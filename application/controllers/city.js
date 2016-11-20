var http=require('../libs/http.js');
var CityModel=require('../models/city.js');

/**
* @param object express The basic express onject that handles the http request
*/
function City(express)
{
  var self=this;
  var endpoint='/city';

  express.get(endpoint,function(req, res,next)
  {
    self.get(req, res,next);
  })
  .all(endpoint,function(req, res,next)
  {
    if(http.preprocess(req,res,next,endpoint))
    {
      switch (req.method)
      {
        case http.method.GET:
            self.get(req, res,next);
          break;
        default:
        self.unsupportedAction(req,res,next);
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
    var searchParams={};
    var has_wanted_params=false;

    if(req.query.id)
    {
      searchParams.id=req.query.id;
      has_wanted_params=true;
    }

    if(req.query.name)
    {
      searchParams.name=req.query.name;
      has_wanted_params=true;
    }

    if(req.query.long)
    {
      searchParams.long=req.query.long;
      has_wanted_params=true;
    }

    if(req.query.lat)
    {
      searchParams.lat=req.query.lat;
      has_wanted_params=true;
    }

    console.log(req.query);

    if(!has_wanted_params && Object.keys(req.query).length)
    {
      res.status(http.status.HTTP_400_BAD_REQUEST);
      res.send('The requested parameters you have given are not valid');
    }
    else
    {
      var model=new CityModel();
      model.search(searchParams,function(status)
      {
        http.create_response(status,res);
      })
    }
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
