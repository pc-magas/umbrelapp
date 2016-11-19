var http_status=require('../libs/http_codes.js');

/**
* @param object express The basic express onject that handles the http request
*/
function Weather(express)
{
  var self=this;
  var endpoint='/city';

  express.use(endpoint,function(req, res)
  {
    switch (req.method) {
      case 'GET':
          self.get(req, res);
        break;
      default:
      self.unsupportedAction(req,res);
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
    res.send("Hello");
  };

  /**
  * Default handler for unwanted http methods
  * @param req The http request
  * @param res The http response
  * @param next The next express.js http handler
  */
  self.unsupportedAction=function(req,res,next)
  {
    res.status(http_status.HTTP_405_NOT_ALLOWED);
    res.send('None shall pass');
  }
}

module.exports=Weather;
