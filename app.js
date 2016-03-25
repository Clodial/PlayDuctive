// app.js

// modules ======================================
var express 		= require('express');
var path			= require('path');
var app				= express();
var router			= require('./app/routes/main-routes');
//uncomment for route testing
//var router 			= require('./app/routes/route-test');

// configuration ===============================

app.set('port', (process.env.PORT || 1337));

app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'ejs');

app.use('/', router);

app.use(express.static(__dirname + '/public'));

app.listen(app.get('port'));

module.exports = app;