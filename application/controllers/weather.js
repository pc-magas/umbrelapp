var http=require('../libs/http.js');
var WeatherModel=require('../models/weather.js');

/**
* @param object express The basic express onject that handles the http request
*/
function Weather(express)
{
  var self=this;
  var endpoint='/weather';

  express.get(endpoint,function(req, res,next)
  {
    self.get(req, res,next);
  })
  .all(endpoint,function(req, res,next)
  {
    if(http.preprocess(req,res,next,endpoint))
    {
      switch (req.method) {
        //Just ot make sure thet get will execute all
        case http.method.GET:
            self.get(req, res,next);
          break;
        default:
        self.unsupportedAction(req,res,next);
      }
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
    var model=new WeatherModel();

    model.search({
                    'from_time':'2016-11-19 24:13:02',
                  },
                  function(status)
                  {
                    http.create_response(status,res,req.method);
                  }
                );
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

module.exports=Weather;
