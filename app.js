// app.js
'use string';
// modules ======================================
var express 		= require('express');
var path			= require('path');
var session 		= require('express-session');
var cookie			= require('cookie-session');
var app				= express();
var router			= require('./app/routes/main-routes');
//uncomment for route testing
//var router 			= require('./app/routes/route-test');

// configuration ===============================

app.set('port', (process.env.PORT || 1337));

app.set('trust proxy', 1);

app.use(cookie({
	name: 'session',
	keys: ['key1', 'key2']
}));

app.set('views', path.join(__dirname, 'public/view'));
app.set('view engine', 'ejs');

app.use(function(req, res, next){

	req.session.views = (req.session.views || 0) + 1;

	next();

});

app.use('/', router);

app.use(express.static(__dirname + '/public'));

app.listen(app.get('port'));

module.exports = app;