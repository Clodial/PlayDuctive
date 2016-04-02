var express     = require('express');
var bodyParser  = require('body-parser');
var path 	    = require('path');
var mysql 	    = require('mysql');
//var session     = require('express-session');
//var mysqlStore  = require('express-mysql-session')(session);

//database connection stuff
var con = mysql.createConnection(process.env.JAWSDB_URL);
var router 	= express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//Index page route
router.get('/', function(req,res){
    var projList = [];
    //console.log(req.session.user);
    //res.render('index', { title: 'PlayDuctive', user: req.session.user});
    if(!req.session.user){
	   res.render('index', { title: 'PlayDuctive', proj: null, user: req.session.user});
    }else{
        con.query('select Projects.projName as name, Statuses.statusName as stat from Projects, Classes, Statuses, Accounts, AccountTasks where Accounts.accountUser = ? and Accounts.accountId = Classes.accountId and Classes.classId = AccountTasks.classId and AccountTasks.projId = Projects.projId and Projects.statusId = Statuses.statusId;', [req.session.user],
            function(err, result){
                for(var i = 0; i < result.length; i++){
                    console.log(result.name);
                    console.log(result.status);
                    projList.push([result.name, result.status]);
                }
                res.render('login', { title: 'PlayDuctive', proj: projList, user: req.session.user});
            });
        res.render('login', { title: 'PlayDuctive', proj: projList, user: req.session.user});
    }
});

router.get('/logCheck', function(req,res){
    var user = req.query.user;
    var pass = req.query.pass;
    if(!req.session.user){
        con.query('select Accounts.accountId from Accounts where accountUser = ? and accountPass = ? and accountLog = 0', [user,pass],
            function(err,result){
                console.log("underwent stuff yo");
                if(err){
                    console.log('QUERY ERROR');
                    console.log(err.code);
                }else{
                    if(result.length > 0){
                        req.session.logIn = true;
                        req.session.user = user;
                        console.log(req.session.user);
                        //res.redirect('/');
                        res.render('login', { title: 'PlayDuctive', proj: null, user: req.session.user});
                    }else{
                        console.log(req.session.user);
                        //res.redirect('/');
                        res.render('index', { title: 'PlayDuctive', proj: null, user: req.session.user});
                    }
                }

            }
        );
    }else{
        res.redirect('/');
    }
});

//Login routes
router.get('/login', function(req,res){
    console.log(req.session.user);
	res.render('login', { title: 'PlayDuctive', proj: null, user: req.session.user});
});

//Login functionality
router.post('/login', function(req, res){
    var user = req.body.user;
    var email = req.body.email;
    var pass = req.body.pass;
    con.query('CALL createAccount(?,?,?)', [user, pass, email],
        function (err, result) {
            if (err) {
                console.log('QUERY ERROR');
                console.log(err.code);
                res.redirect('/');
            } else {
                console.log("success: " + true);
                console.log(req.session.user);
                req.session.user = user;
                //res.redirect('/');
                res.render('login', {title: 'PlayDuctive', proj: null, success: "success", user: req.session.user});
            }
        }
    );
});

router.post('/login/usetest', function(req,res){
    var user = req.body.user;  
    con.query('select accountId from Accounts where accountUser = ? and accountLog = 0', [user],
        function (err, result) {
            resultNum = 0;
            if (err) {
                console.log(err.code);
            } else {
                if(result.length > 0 || user == ''){
                    console.log(result.length);
                    res.send(JSON.stringify("invalid"));
                }else{
                //res.send(result[0].accountId);
                    res.send(JSON.stringify("valid"));
                }
            }
        }
    );
});
// Logout button
router.get('/login/logout', function(req,res){
    req.session.destroy();
    res.redirect('/');
});

//project creation routes
router.get('/makeProject', function (req, res) {
    //res.sendFile(path.join(__dirname + '/public/view/create_project.html'));
    if(!req.session.user){res.redirect('/');}
    res.render('makeProject',{ title: 'PlayDuctive', user: req.session.user});
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
