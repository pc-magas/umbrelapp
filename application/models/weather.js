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

    query=db.select([table+'.id',table+'.date',table+'.temperature_max',table+'.temperature_min','city.name','city.country'])
            .withSchema('public')
            .from(table)
            .join('city',table+'.city_id','city.id')

    if(params.from_time)
    {
      //Validating date
      var date=moment(params.from_time,['YYYY-MM-DD HH:mm:ss','YYYY-MM-DD']);
      if(!date.isValid())
      {
        returnStatus.statusError(returnStatus.errorTypes.wrong_param);
        returnStatus.message="The startup datetime you given is not the correct one";
        callback(returnStatus);

        return;
      }

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

      returnStatus.statusError(returnStatus.errorTypes.wrong_param);
      returnStatus.message="For duration you must specify the start date.";

      callback(returnStatus);
    }

    // Searching by City
    if(params.city_id)
    {
      if(params.city_name)
      {
        returnStatus.statusError(returnStatus.errorTypes.wrong_param);
        returnStatus.message="Only City id must be given";
        callback(returnStatus);
        return;
      }
      params.city_id=parseInt(params.city_id);

      if(isNaN(params.city_id))
      {
        returnStatus.statusError(returnStatus.errorTypes.wrong_param);
        returnStatus.message="The City id must be a positive integer";
        callback(returnStatus);
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
