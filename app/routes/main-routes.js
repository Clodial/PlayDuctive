var express = require('express');
var router 	= express();
var path 	= require('path');
var mysql 	= require('mysql');

//database connection stuff
var con = mysql.createConnection(process.env.JAWSDB_URL);

//Index page route
router.get('/', function(req, res, next) {
 	con.connect();
 	con.query('SELECT 1 + 1 AS solution', function(err,row,fields){
 		if (err) throw err;
 		console.log('The solution is: ', rows[0].solution);
 		res.render(__dirname + '../js/index.js',rows[0].solution);
 	});
  	res.sendFile(path.join(__dirname + 'index.html'));
  	con.end();
});

module.exports = router;
/*
var apiRouter= express.Router;

module.export = function() {

	apiRotuer.get('/,', function(req, res){})

	apiRouter.use('/use')


	apiRouter.route('/route')
		.get(function(req, res){})
		.post(function(req, res){});
	return apiRouter; 
}*/