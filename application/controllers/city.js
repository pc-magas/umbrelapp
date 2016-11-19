var http=require('../libs/http.js');

/**
* @param object express The basic express onject that handles the http request
*/
function City(express)
{
  var self=this;
  var endpoint='/city';

  express.use(endpoint,function(req, res,next)
  {
    if(req.originalUrl!=endpoint)
    {
        next();
        return;
    }

    switch (req.method) {
      case http.method.GET:
          self.get(req, res,next);
        break;
      default:
      self.unsupportedAction(req,res,next);
    }
  });

  /**
  * Handler for http Get method
  * @param req The http request
  * @param res The http response
  * @param next The next express.js http handler
  */
  self.get=function(req,res,next)
  {
    res.send("Hello City");
  };

  /**
  * Default handler for unwanted http methods
  * @param req The http request
  * @param res The http response
  * @param next The next express.js http handler
  */
  self.unsupportedAction=function(req,res,next)
  {
    res.status(http.status.HTTP_405_NOT_ALLOWED);
    res.send('None shall pass');
  }
}

module.exports=City;
