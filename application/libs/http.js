var utils=require('./utils.js');

module.exports={
  'status':{
                  'HTTP_200_OK':200,
                  'HTTP_201_CREATED':201,
                  'HTTP_202_ACCEPTED':202,
                  'HTTP_400_BAD_REQUEST':400,
                  'HTTP_403_ACCESS_DENIED':403,
                  'HTTP_404_NOT_FOUND':404,
                  'HTTP_405_NOT_ALLOWED':405,
                  'HTTP_409_CONFLICT':409,
                  'HTTP_500_INTERNAL_ERROR':500
                },
    'method':{
                'GET':'GET',
                'POST':'POST',
                'PATCH':'PATCH',
                'DELETE':'DELETE'
              },
    /**
    * A General method that preprocesses all Http the requests
    *
    * @param object request The Http request
    * @param object response The hettp response
    * @param object next A way to move to the next handler for this route
    * @param string route The string for the route
    *
    * @return boolean
    *
    * It returns false if it you cannot move to the next route
    */
    'preprocess':function(request,response,next,route)
    {
        /**
        * Sometimes we want for similar endpoints to have different handler
        * With that we can move to the next handler
        */
        if(route && request.originalUrl!=route)
        {
          next();
          return false;
        }

        return true;
    },
    'create_response':function(status,res,method)
    {
        if(!method)
        {
          method=this.method.GET;
        }

        //Ok Status codes on success
        method_ok={}
        method_ok[this.method.GET]=this.status.HTTP_200_OK;
        method_ok[this.method.POST]=this.status.HTTP_201_CREATED;
        method_ok[this.method.PATCH]=this.status.HTTP_202_ACCEPTED;
        method_ok[this.method.DELETE]=this.status.HTTP_202_ACCEPTED;

        res.setHeader('content-type', 'application/json');

        var sendData={"message":'An Internal error occured'};

        if(status.isOk())
        {
          if(method===this.method.GET && utils.isEmpty(status.data))
          {
            res.status(this.status.HTTP_404_NOT_FOUND);
            sendData.message="There are no requested data";
          }
          else
          {
            res.status(method_ok[method]);
            if(status.data)
            {
              sendData=status.data;
            }
          }
        }
        else if(status.isErr())
        {
            if( status.error_type===status.errorTypes.missing_param ||
              status.error_type===status.errorTypes.wrong_param
            )
            {
              res.status(this.status.HTTP_400_BAD_REQUEST);
            }
            else if(status.error_type===status.errorTypes.access_denied)
            {
              res.status(this.status.HTTP_403_ACCESS_DENIED);
            }
            else
            {
              res.status(this.status.HTTP_500_INTERNAL_ERROR);
            }
        }

        if(!utils.isEmpty(status.message))
        {
          sendData.message=status.message;
        }

        res.end(JSON.stringify(sendData));
    },
    /**
    * Common execution code when http authentication is required
    * @param object request The Http request
    * @param object response The hettp response
    * @param object next A way to move to the next handler for this route
    * @param string route The string for the route
    * @param function callback Function that is executed when all green
    */
    'auth_preprocess':function(request,response,next,route,callback)
    {
      var self=this;

      var getCredentials=function()
      {
        var header=request.headers['authorization']||'',        // get the header
            token=header.split(/\s+/).pop()||'',            // and the encoded auth token
            auth=new Buffer(token, 'base64').toString(),    // convert from base64
            parts=auth.split(/:/),                          // split on colon
            credentials={'username':parts[0],'password':parts[1]};

            return credentials
      }


      if(self.preprocess(request,response,next,route))
      {
        var credentials=getCredentials();

        var User=require('../models/user.js');
        var user_model=new User();

        user_model.login(credentials.username,credentials.password,function(status)
        {
          if(status.isOk())
          {
            callback(status.data.id);
          }
          else
          {
            console.log("Status Outside"+status.error_type);
            self.create_response(status,response,request.method);
          }
        })
      }
    }
};
