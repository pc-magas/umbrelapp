var db=require('../config/db.js');
var ActionStatus=require('../libs/model_status.js');
var moment=require('moment');

function Weather()
{
  var self=this;

  var table='weather';

  /**
  * Method we use to search the weather from the database
  *
  * @param object params The input parameters
  *
  * It must have some of the following parameters
  * 'from_time' The day we want to search for the weather forecast
  * 'duration'  How many days we want a weather forecast
  * 'city_name' The name of the specific city we want a forecast
  * 'city_id' The id of the specific city we want a forecast
  *
  * @param function callback A callback that is used to return the data
  *
  */
  self.search=function(params,callback)
  {
    var returnStatus = new ActionStatus();

    var query=db.select(db.raw(table+'.date::varchar as date'))
              .select(table+'.id',table+'.temperature_max',table+'.temperature_min','city.name','city.country')
            .withSchema('public')
            .from(table)
            .join('city',table+'.city_id','city.id')

    /**
    * Handler in case we want to terminate the database connection and return an error.
    *
    * @param status An errorous status case.
    * @param message A massage in case of error.
    */
    var errorHandler=function(message)
    {
      returnStatus.statusError(returnStatus.errorTypes.wrong_param);
      returnStatus.message=message;

      callback(returnStatus);
    }

    if(params.from_time)
    {
      //Validating date
      var date=moment(params.from_time,['YYYY-MM-DD HH:mm:ss','YYYY-MM-DD']);
      if(!date.isValid())
      {
        errorHandler("The startup datetime shoulf be in YYYY-MM-DD or YYYY-MM-DD HH:mm:ss format")
        return;
      }

      console.log(date.format('YYYY-MM-DD'));

      //Selecting Duration
      if(params.duration)
      {
        var date_end=moment(date.toDate()).add(parseInt(params.duration),'days');
        query.whereBetween(table+'.date',[date.format('YYYY-MM-DD'),date_end.format('YYYY-MM-DD')])
      }

      //Selecting by date
      query.where(table+'.date',date.format('YYYY-MM-DD'));

    }
    else if(params.duration) //Duration given only
    {
      errorHandler("For duration you must specify the start date.");
      return
    }

    // Searching by City
    if(params.city_id)
    {
      if(params.city_name)
      {
        errorHandler("Only City id must be given");
        return;
      }
      params.city_id=parseInt(params.city_id);

      if(isNaN(params.city_id))
      {
        errorHandler("The City id must be a positive integer");
        return;
      }

      query.where(table+'.city_id',  params.city_id);
    }
    else if(params.city_name)
    {
      params.city_name=params.city_name.split(',');

      query.where('city.name',params.city_name[0].trim());

      // If country spefified
      if(params.city_name[1])
      {
        query.where('city.country',params.city_name[1].trim());
      }
    }

    query.orderBy(table+'.date','ASC');

    // Returning the data
    query.then(function(data)
    {
        returnStatus.statusOK();
        returnStatus.data=data;
        callback(returnStatus);
    });

  }

}

module.exports=Weather;
