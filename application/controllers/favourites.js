var http=require('../libs/http.js');

/**
* @param object express The basic express onject that handles the http request
*/
function Favourite(express)
{
  var self=this;
  var endpoint='/city/favourites';

  express.use(endpoint,function(req, res)
  {
    if(http.preprocess(req,res,next,endpoint))
    {
      switch (req.method) {
        case http.method.GET:
            self.get(req, res);
          break;
        case http.method.POST:
            self.post(req, res);
          break;
        case http.method.PATCH:
            self.patch(req, res);
          break;
        case http.method.DELETE:
            self.delete(req, res);
          break;
        default:
        self.unsupportedAction(req,res);
      }
    }
    return;
  });

  /**
  * Handler for http Get method
  * @param req The http request
  * @param res The http response
  * @param next The next express.js http handler
  */
  self.get=function(req,res,next)
  {
    res.send("Hello favourites");
  };

  /**
  * Handler for http POST method
  * @param req The http request
  * @param res The http response
  * @param next The next express.js http handler
  */
  self.post=function(req,res,next)
  {
    res.send("Hello favourites");
  };

  /**
  * Handler for http PATCH method
  * @param req The http request
  * @param res The http response
  * @param next The next express.js http handler
  */
  self.patch=function(req,res,next)
  {
    res.send("Hello favourites patch");
  };

  /**
  * Handler for http DELETE method
  * @param req The http request
  * @param res The http response
  * @param next The next express.js http handler
  */
  self.delete=function(req,res,next)
  {
    res.send("Hello favourites");
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

module.exports=Favourite;
