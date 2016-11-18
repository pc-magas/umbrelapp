var http_status=require('../libs/http_codes.js');

function Weather(express)
{
  var self=this;
  var endpoint='/weather';

  express.use(endpoint,function(req, res,next)
  {
    switch (req.method) {
      case 'GET':
          self.get(req, res,next);
        break;
      default:
      self.unsupportedAction(req,res,next);
    }
  });

  self.get=function(req,res,next)
  {
    res.send("Hello");
  };

  self.unsupportedAction=function(req,res,next)
  {
    res.status(http_status.HTTP_405_NOT_ALLOWED);
    res.send('None shall pass');
  }
}

module.exports=Weather;
