// app.js

// modules ======================================
var express 		= require('express');
var app				= express();
var adRouter		= express.Router();
var path 			= require('path');

// configuration ===============================

app.set('port', (process.env.PORT || 1337));

app.use(express.static(__dirname + '/public'));

app.get(function(req,res){
	res.send("It Broke");
});
app.get('/', function(req,res){
	res.sendFile(path.join(__dirname + '/public/view/index.html'));
});


app.listen(app.get('port'));

module.exports = app;