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
    var input_data={};

    var has_wanted_parameters=false;
    if(req.query.city_id)
    {
      input_data['city_id']=req.query.city_id;
      has_wanted_parameters=true;
    }

    if(req.query.city_name)
    {
      input_data['city_name']=req.query.city_id;
      has_wanted_parameters=true;
    }

    if(req.query.from_timestamp)
    {
      input_data['from_time']=req.query.from_timestamp;
      has_wanted_parameters=true;
    }

    if(req.query.forecast_duration)
    {
      input_data['duration']=req.query.forecast_duration;
      has_wanted_parameters=true;
    }

    if(!has_wanted_parameters && !Object.keys(req.query).length)
    {
      res.status(this.status.HTTP_400_BAD_REQUEST);
      res.send('The requested parameters you have given are not valid');
    }
    else
    {
        var model=new WeatherModel();
        model.search(input_data,
                    function(status)
                    {
                      http.create_response(status,res,req.method);
                    });
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

module.exports=Weather;
