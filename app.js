// app.js

// modules ======================================
var express 		= require('express');
var app				= express();
var router 			= require('./app/routes/main-routes');
var users 			= require('./app/routes/main-users');
var adRouter		= express.Router();
var path 			= require('path');

// configuration ===============================

app.set('port', (process.env.PORT || 1337));

app.use(express.static(__dirname + '/public'));

app.use('/', router);
app.use('/users', users);

app.get(function(req,res){
	res.send("It Broke");
});

app.listen(app.get('port'));

module.exports = app;