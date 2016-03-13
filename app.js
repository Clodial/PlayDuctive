// app.js

// modules ======================================
var express 		= require('express');
var app				= express();
var bodyParser		= require('body-parser');
var methodOverride	= require('method-override');

// configuration ===============================

var port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname + '/public')));

app.get('*', function(req,res){
		console.log("yo");
		res.render(__dirname + 'view/index.html');
})

app.listen(8080);