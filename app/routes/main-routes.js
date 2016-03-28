var express = require('express');
var bodyParser = require('body-parser');
var path 	= require('path');
var mysql 	= require('mysql');

//database connection stuff
var con = mysql.createConnection(process.env.JAWSDB_URL);
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

//Login routes
router.get('/login', function(req,res){
    var logIn = req.session.loggedIn;
	res.render('login', { title: 'PlayDuctive', logged: logIn, views: req.session.views});
});
router.post('/login', function(req, res){
    var user = req.body.user;
    var email = req.body.email;
    var pass = req.body.pass;
    con.query('CALL createAccount(?,?,?)', [user, pass, email],
        function (err, result) {
            if (err) {
                console.log('QUERY ERROR');
                console.log(err.code);
            } else {
                console.log("success: " + true);
                res.render('login', {title: 'PlayDuctive', success: "success"});
            }
        }
    );
});

router.post('/login/usetest', function(req,res){
    var user = req.body.user;  
    //var status = selectQuery('select * from Accounts where accountUser = ?', [req.body.user]);
    //select * from Accounts where accountUser = ?
    con.query('select accountId from Accounts where accountUser = ?', [user],
        function (err, result) {
            resultNum = 0;
            if (err) {
                console.log(err.code);
            } else {
                if(result.length > 0){
                    console.log(result[0].accountId);
                    res.end(result[0].accountId);
                }
                //res.send(result[0].accountId);
                res.end("valid");
            }
        }
    );
});


//project creation routes
router.get('/create_project.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/view/create_project.html'));
});

router.get('/create_project.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/app/components/create_project.js'));
});

router.post('/create_project/posts', function (req, res) {
    var accountName = req.body.accountName;
    var accountPass = req.body.accountPass;
    var projType = req.body.projType;
    //var status = req.body.status; //default to incomplete
    var projName = req.body.projName;
    var projDesc = req.body.projDesc;

    //insert validation of values here(types, length requirement, etc.)

    // call stored procedure that creates a project
    var status = runQuery('CALL createProject(?,?,?,?);', [projType, "INCOMPLETE", projName, projDesc]);
    if (status) {
        res.json({ success: "true" });
    } else {
        res.json({ success: "false" });
    }
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
