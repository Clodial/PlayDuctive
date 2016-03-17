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

app.set('port', (process.env.PORT || 1337));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res){
	res.sendFile(path.join(__dirname + '/public/view/index.html'));
});


app.listen(app.get('port'));
console.log('at least this hopefully works');

module.exports = app;