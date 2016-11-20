var http=require('../libs/http.js');
var Favourites=require('../models/favourites.js');

/**
* @param object express The basic express onject that handles the http request
*/
function Favourite(express)
{

  var self=this;
  var endpoint='/city/favourites';
  var model= new Favourites();

  express.get(endpoint,function(req,res,next)
  {
    http.auth_preprocess(req,res,next,endpoint,
    function(user_id)
    {
      self.get(req, res, user_id);
    });

  })
  .all(endpoint,function(req, res, next)
  {
    http.auth_preprocess(req,res,next,endpoint,
    function(user_id)
    {
      switch (req.method)
      {
        case http.method.GET:
            self.get(req, res, next);
          break;
        case http.method.POST:
            self.post(req, res, next, user_id);
          break;
        case http.method.DELETE:
            self.delete(req, res, next);
          break;
        default:
        self.unsupportedAction(req,res);
      }
    });

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
    res.end("Hello favourites");
  };

  var bodyRequestHandler=function(req,res,callback)
  {
    console.log(req.body.city_id);
    if(Object.keys(req.body).length==1 && req.body.city_id)
    {
      callback(req.body.city_id);
    }
    else
    {
      res.status(http.status.HTTP_400_BAD_REQUEST);
      res.send('The requested parameters you have given are not valid');
    }
  }

  /**
  * Handler for http POST method
  * @param req The http request
  * @param res The http response
  * @param next The next express.js http handler
  */
  self.post=function(req,res,next,user_id)
  {
    bodyRequestHandler(req,res,function(city_id)
    {
      model.add(user_id,city_id,function(status)
      {
        http.create_response(status,res,req.method);
      });
    });
  };

  /**
  * Handler for http DELETE method
  * @param req The http request
  * @param res The http response
  * @param next The next express.js http handler
  */
  self.delete=function(req,res,next)
  {
    bodyRequestHandler(req,res,function()
    {
      //TODO: Add Delete Action
      res.send("Hello favourites");
    });
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
