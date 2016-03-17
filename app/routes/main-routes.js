//main-routes.js
console.log("yooo");
var express = require('express');
var router  = express();
var path 	= require("path");

app.get('/', function(req,res,next){
	res.sendFile(path.join(__dirname + '/public/view/index.html'));
});