// app.js

// modules ======================================
var express 		= require('express');
var path			= require('path');
var app				= express();
var router 			= require('./app/routes/main-routes');
var users 			= require('./app/routes/main-users');

// configuration ===============================

app.set('port', (process.env.PORT || 1337));

app.use(express.static(__dirname + '/public'));

app.use('/', router);
app.use('/users', users);

app.listen(app.get('port'));

module.exports = app;