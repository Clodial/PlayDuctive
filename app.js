// app.js
'use string';
// modules ======================================
var express 		= require('express');
var path			= require('path');
var mysql 			= require('mysql');
var session 		= require('express-session');
var mysqlStore 		= require('express-mysql-session')(session);
var cookie			= require('cookie-session');
var app				= express();
var router			= require('./app/routes/main-routes');
//uncomment for route testing
//var router 			= require('./app/routes/route-test');

// configuration ===============================

var con = mysql.createConnection(process.env.JAWSDB_URL);
/*var options = {
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'root',
	database: 'playDuctive'
}
var tryCon = mysql.createConnection(options);*/
var sessionStore = new mysqlStore(con);

app.use(express.static(__dirname + '/public'));

app.set('port', (process.env.PORT || 1337));

app.set('trust proxy', 1);

app.use(session({
	key: 'session',
	secret: 'secretSession',
	store: sessionStore,
	resave: true,
	saveUninitialized: true
}));

app.use(cookie({
	name: 'session',
	keys: ['key1', 'key2']
}));

app.set('views', path.join(__dirname, 'public/view'));
app.set('view engine', 'ejs');

app.use(function(req, res, next){

	req.session.views 	= (req.session.views || 0) + 1;
	req.session.user 	= null;
	req.session.logIn 	= false;	
	next();

});

app.use('/', router);

app.listen(app.get('port'));

module.exports = app;