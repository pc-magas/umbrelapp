var express = require('express')
var bodyParser = require('body-parser')

var app = express()

// All cals should be application/json parser
var jsonParser = bodyParser.json()
app.use(jsonParser);

/**
* Append Below here your api endpoints
*/
