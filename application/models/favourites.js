var db=require('../config/db.js');
var ActionStatus=require('../libs/model_status.js');
var City=require('./city.js');
var utils=require('../libs/utils.js');

function Favourites()
{
  var self=this;
  var table='user_favourite_city';

  /**
  * Handler in case we want to return an error.
  *
  * @param status An errorous status case.
  * @param message A massage in case of error.
  */
  var errorHandler=function(message,returnStatus,callback,statusError)
  {
    if(!statusError)
    {
      returnStatus.statusError(returnStatus.errorTypes.wrong_param);
    }
    else
    {
      returnStatus.statusError(statusError);
    }

    returnStatus.message=message;

    callback(returnStatus);
  }

  /**
  * Method that searched for an entry and returns it via callback
  * @param numeric user_id
  * @param numeric city_id
  * @param function callback
  */
  var entry_exists=function(user_id,city_id,callback)
  {
    db(table).first('user_id','city_id')
    .where({'user_id':user_id,'city_id':city_id})
    .then(function(data)
    {
      callback(data);
    });
  }

  /**
  * Searches all the entries having user_id
  * and returns all the information regarding the cities
  */
  self.search=function(user_id,page,limit,callback)
  {
    var returnStatus=new ActionStatus();

    var selectErrorHandler=function(message,status)
    {
      errorHandler(message,returnStatus,callback,status);
    }

    if(!user_id)
    {
      selectErrorHandler('No user id specified',returnStatus.errorTypes.access_denied)
    }
    else
    {
        var query=db.withSchema('public')
                    .from('city')
                    .join(table,table+'.city_id','city.id')
                    .select('city.id','city.name','city.country')
                    .where(table+'.user_id',user_id)
                    .orderBy('city.name','ASC').orderBy('city.country','ASC');

        if(!limit)
        {
          limit=10;
        }

        if(page)
        {
          page=parseInt(page);
          limit=parseInt(limit);
          var offset=utils.offset_calculate(page,limit);
          query.limit(limit).offset(offset);
        }

        query.then(function(data)
        {
            returnStatus.statusOK();
            returnStatus.data=data;
            callback(returnStatus);
        });
    }
  };

  /**
  * Method that Inserts a new favourite city to the user
  * @param numeric user_id
  * @param numeric city_id
  * @param function callback
  */
  self.add=function(user_id,city_id,callback)
  {
    var returnStatus=new ActionStatus();

    var addErrorHandler=function(message,status)
    {
      errorHandler(message,returnStatus,callback,status);
    }

    if(!user_id)
    {
      addErrorHandler('No user id specified')
    }
    else if(!city_id)
    {
      addErrorHandler('No city specified')
    }
    else
    {
      var mycity=new City();

      mycity.search({'id':city_id},function(status)
      {
        if(status.isOk() && status.data.length>0)
        {
          entry_exists(user_id,city_id,function(data)
          {
            if(!data)
            {
              db(table).insert({'user_id':user_id,'city_id':city_id})
              .then(function(data)
              {
                returnStatus.statusOK();
                returnStatus.message="The entry sucessfully inserted"
                callback(returnStatus);
              });

              return;
            }
            else
            {
              addErrorHandler("The entry already exists",returnStatus.errorTypes.conflict);
            }
          });
        }
        else
        {
          addErrorHandler('The city you given does not exist');
        }
      })
    }
  };

  /**
  * Method that Inserts a new favourite city to the user
  * @param numeric user_id
  * @param numeric city_id
  * @param function callback
  */
  self.delete=function(user_id,city_id,callback)
  {
    var returnStatus=new ActionStatus();

    var addErrorHandler=function(message,status)
    {
      errorHandler(message,returnStatus,callback,status);
    }

    if(!user_id)
    {
      addErrorHandler('No user id specified')
    }
    else if(!city_id)
    {
      addErrorHandler('No city specified')
    }
    else
    {
      entry_exists(user_id,city_id,function(data)
      {
        if(!data)
        {
          addErrorHandler("There it not such a city as favourite",returnStatus.errorTypes.conflict);
        }
        else
        {
          db(table)
          .where({'user_id':user_id,'city_id':city_id})
          .del()
          .then(function(data)
          {
            returnStatus.statusOK();
            returnStatus.message="The entry sucessfully deleted"
            callback(returnStatus);
          });
        }
      });
    }
  }

}

module.exports=Favourites;
