var express = require('express');
var path 	= require('path');
var mysql 	= require('mysql');

//database connection stuff
var con = mysql.createConnection(process.env.JAWSDB_URL);
var router 	= express.Router();
//Index page route
function runQuery(query, paramList) {
    /**
    * @ Runs an arbitrary query with arbitrary parameters
    * @ query: A MySQL query, with ? for the parameters
    * @ paramList: A list of parameter values that line up with the query
    */

    //query the database
    con.query(query, paramList,
        function (err, result) {
            if (err) {
                console.log('QUERY ERROR');
                console.log(err.code);
                return false;
            } else {
                return true;
            }
        }
    );
    //don't need this either
    //close the connection
    //connection.end();
}

module.export = function(){

	router.get('/', function(req,res,next){
		if
		res.sendFile(path.join(__dirname + '../../../public/view/index.html'));
	});

	router.get('/login', function(req,res,next){
		res.sendFile(path.join(__dirname + '../../../public/view/login.html'));
	});

	return router;

}

module.exports = router;
/*
var apiRouter= express.Router();

module.export = function() {

	apiRotuer.get('/,', function(req, res){})

	apiRouter.use('/use')


	apiRouter.route('/route')
		.get(function(req, res){})
		.post(function(req, res){});
	return apiRouter; 
}*/