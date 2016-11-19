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
    }
};
