var db=require('../config/db.js');
var ActionStatus=require('../libs/model_status.js');

function City()
{
  var self=this;
  var table='city';
  /**
  * Method we use to search the weather from the database
  *
  * @param object params The input parameters
  *
  * It must have some of the following parameters
  * 'id' A city Id
  * 'name' The name of the specific city
  * 'long' The longtitude of the city
  * 'lat' The latitude of the city
  *
  * @param function callback A callback that is used to return the data
  */
  self.search=function(params,callback)
  {
    var returnStatus=new ActionStatus();

    var query=db.select(['id','name','country','coordinates']).from(table);

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

    if(params.id)
    {
      if(Object.keys(params).length===1) //Only is should be given
      {
        query.where('id',params.id);
      }
      else
      {
          errorHandler("Only id should be given");
          return;
      }
    }
    else
    {
      if(params.name)
      {
        params.name=params.name.split(',');
        query.where('name',params.name[0].trim());

        // If country spefified
        if(params.name[1])
        {
          query.where('city.country',params.name[1].trim());
        }
      }

      if(params.long && params.lat)
      {
        //Converting coordinates as Floating point numbers in order to prevent sql injection
        params.long=parseFloat(params.long);
        params.lat=parseFloat(params.lat);

        if(isNaN(params.long) || isNaN(params.lat))
        {
            errorHandler("Both long and lat must be valid coordinates");
            return;
        }

        //Finding the closest city
        var distanceQuery="coordinates <@> POINT("+params.long+","+params.lat+")";
        var subquery=db.raw("SELECT MIN("+distanceQuery+") AS distance FROM "+table);

        query.whereRaw(distanceQuery +"IN (SELECT MIN("+distanceQuery+") AS distance FROM "+table+")");
      }
      else if(params.long || params.lat)
      {
        errorHandler("Both long and lat must be given");
        return;
      }
    }

    query.then(function(data)
    {
      returnStatus.statusOK();
      returnStatus.data=data;
      callback(returnStatus);
    });

  }
}

module.exports=City;
