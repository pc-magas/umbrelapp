var db=require('../config/db.js');
var passwordHash = require('password-hash');
var ActionStatus=require('../libs/model_status.js');


function User()
{
  var self=this;
  var table='user'

  /**
  * Method that checks if a user having username exists
  * and calls the callback regardles the situation
  *
  * @param string username
  * @param function callback
  */
  self.onUserExists=function(username,callback)
  {

    db.first('*')
    .from(table)
    .where('username',username)
    .then(function(data)
    {
      callback(data);
    });
  };

  /**
  * Method that authenticates the user
  */
  self.login=function(username,password,callback)
  {
    /**
    * Handler in case we want to terminate the database connection and return an error.
    *
    * @param message A massage in case of error.
    * @param status An errorous status case.
    */
    var errorHandler=function(message,status)
    {
      if(!status)
      {
        returnStatus.statusError(returnStatus.errorTypes.wrong_param);
      }
      else
      {
        returnStatus.statusError(status);
      }
      returnStatus.message=message;

      callback(returnStatus);
    }

    var returnStatus=new ActionStatus();

    if(username && password)
    {
      self.onUserExists(username,function(data)
      {
        if(!data)
        {
          errorHandler('User does not exist!',returnStatus.errorTypes.access_denied);
        }
        else
        {
            console.log('Here');
            if(passwordHash.verify(password,data.password))
            {
              returnStatus.statusOK();
              returnStatus.data={'id':data.id,'username':data.username};
              callback(returnStatus);
            }
            else
            {
              console.log('Here');
              errorHandler('Wrong credentials provided!',returnStatus.errorTypes.access_denied);
            }
            return;
        }
      });
    }
    else
    {
      errorHandler('No credentials provided!',returnStatus.errorTypes.access_denied);
    }

    return;
  };

  self.register=function(username,password)
  {
    self.onUserExists(username,function(data)
    {
      if(!data && username && password)
      {
        db(table).insert({'username':username,'password':passwordHash.generate(password)})
        .then(function(data)
        {
          console.log('User sucessfully registered');
        })
      }
    })
  };
}

module.exports=User;
