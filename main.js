var express = require('express')
var bodyParser = require('body-parser')

var app = express();

// All cals should be application/json parser
var jsonParser = bodyParser.json();
app.use(jsonParser);

const path=require('path')
var cwd=process.cwd()

/**
* Append Below here your api endpoints
*/

var Weather=require(path.resolve(cwd,'application/controllers/weather.js'));
var w=new Weather(app);

var City=require(path.resolve(cwd,'application/controllers/city.js'));
var ci=new City(app);

var Favourites=require(path.resolve(cwd,'application/controllers/city.js'));
var fa=new Favourites(app)

/**
* Do not append below here your api endpoints
*/

app.listen(8000, function () {
  console.log('Umbrelapp Backend app listening on port 8000!')
})
