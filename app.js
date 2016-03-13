// app.js

// modules ======================================
var express 		= require('express');
var app				= express();
var logger 			= require('morgan');
var bodyParser		= require('body-parser');
var methodOverride	= require('method-override');

// configuration ===============================

//var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('*', function(req,res){
		console.log("yo");
		res.render('view/index.html');
})

//app.listen(8080);
module.exports = app;