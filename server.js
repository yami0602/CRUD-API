/*
    Express template
*/
var port = 9030;
var express = require('express');
var app = express();
var bodyParser = require("body-parser");

var connection = require('./config')();

//purpose of this is to enable cross domain requests
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));

require('./routes')(app, connection);

app.listen(port);

console.log("Server listening on port " + port);