var http=require('../libs/http.js');
var Favourites=require('../models/favourites.js');

/**
* @param object express The basic express object that handles the http request
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
      self.get(req, res,next, user_id);
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
            self.get(req, res, next,user_id);
          break;
        case http.method.POST:
            self.post(req, res, next, user_id);
          break;
        case http.method.DELETE:
            self.delete(req, res, next,user_id);
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
  self.get=function(req,res,next,user_id)
  {
    res.set("Connection", "close");

    var has_wanted_params=false;

    var page=null;//First page as default
    if(req.query.page)
    {
      page=parseInt(req.query.page);
      if(page==0)
      {
        res.status(http.status.HTTP_400_BAD_REQUEST);
        res.end('Page starts from 1 and not from 0');
        return;
      }
      has_wanted_params=true;

    }

    var limit=10;
    if(req.query.limit)
    {
      limit=parseInt(req.query.limit);
      if(limit==0)
      {
        res.status(http.status.HTTP_400_BAD_REQUEST);
        res.end('Limit cannot be 0');
        return;
      }

      if(!page)
      {
        page=1;
      }
      has_wanted_params=true
    }

    if(!has_wanted_params && Object.keys(req.query).length)
    {
      res.status(http.status.HTTP_400_BAD_REQUEST);
      res.end('The requested parameters you have given are not valid');
    }
    else
    {
      model.search(user_id,page,limit,function(status)
      {
        http.create_response(status,res,req.method);
      });
    }
  };

  /**
  * A general method that handles http requests
  * that need an http body
  *
  * @param object req The http grquest
  * @param object res The http response
  * @param function callback That carries all the logic that http call provides
  */
  var bodyRequestHandler=function(req,res,callback)
  {
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
  * @param numeric user_id The user id for
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
  self.delete=function(req,res,next,user_id)
  {
    bodyRequestHandler(req,res,function(city_id)
    {
      model.delete(user_id,city_id,function(status)
      {
        http.create_response(status,res,req.method);
      });
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
