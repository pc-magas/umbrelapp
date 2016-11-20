var utils=require('./utils.js');

module.exports={
  'status':{
                  'HTTP_200_OK':200,
                  'HTTP_201_CREATED':201,
                  'HTTP_202_ACCEPTED':202,
                  'HTTP_400_BAD_REQUEST':400,
                  'HTTP_404_NOT_FOUND':404,
                  'HTTP_405_NOT_ALLOWED':405,
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
        * With that we can mocve to the next handler
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
          if(!utils.isEmpty(status.data))
          {
            res.status(method_ok[method]);
            sendData=status.data;
          }
          else
          {
              res.status(this.status.HTTP_404_NOT_FOUND);
              sendData.message="There are no requested data";
          }
        }
        else if(status.isErr())
        {
            if( status.type===status.errorTypes.missing_param ||
              status.type===status.errorTypes.wrong_param
            )
            {
              res.status(this.status.HTTP_400_BAD_REQUEST);
            }
            else
            {
              res.status(this.status.HTTP_500_INTERNAL_ERROR);
            }

            if(status.message)
            {
              sendData.message=status.message;
            }
        }

        res.end(JSON.stringify(sendData));
    }
};
