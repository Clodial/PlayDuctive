// app.js

// modules ======================================
var express 		= require('express');
var app				= express();
var adRouter		= express.Router();
var logger 			= require('morgan');
var bodyParser		= require('body-parser');
var methodOverride	= require('method-override');
var path 			= require('path');
var http			= require('http');
var fs 				= require('fs');

// configuration ===============================

app.get('/', function(req,res){
	res.sendFile(path.join(__dirname + '/public/view/index.html'));
});

app.listen(1337);
console.log('at least this hopefully works');
