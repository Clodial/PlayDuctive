var express = require('express');
var bodyParser = require('body-parser');
var path 	= require('path');
var mysql 	= require('mysql');

//database connection stuff
//var con = mysql.createConnection(process.env.JAWSDB_URL);
var router 	= express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//Index page route
router.get('/', function(req,res){
    var logIn = req.session.views;
	res.render('index', { title: 'PlayDuctive', logged: logIn, views: req.session.views});
});

router.post('/', function(req,res){
    res.render('index', { title: 'PlayDuctive'});
});

router.get('/login', function(req,res){
    var logIn = req.session.loggedIn;
	res.render('login', { title: 'PlayDuctive', logged: logIn, views: req.session.views});
});
router.post('/login', function(req, res){
    var user = req.body.user;
    var email = req.body.email;
    var pass = req.body.pass;
});

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