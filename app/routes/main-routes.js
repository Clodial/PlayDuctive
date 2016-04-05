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
    if(!req.session.user || !req.session.stats){
	   res.render('index', { title: 'PlayDuctive', proj: null, user: req.session.user});
    }else{
        con.query('CALL getProjects(?);', [req.session.user],
            function(err, result){
                projList = JSON.stringify(result[0]);
                res.render('login', { title: 'PlayDuctive', proj: projList, stats: req.session.stats, user: req.session.user});
            });
        //res.render('login', { title: 'PlayDuctive', proj: projList, user: req.session.user});
    }
});

router.get('/logCheck', function(req,res){
    var user = req.query.user;
    var pass = req.query.pass;
    if(!req.session.user){
        con.query('select Accounts.accountId from Accounts where accountUser = ? and accountPass = ?', [user,pass],
            function(err,result){
                if(err){
                    console.log('QUERY ERROR');
                    console.log(err.code);
                    res.redirect('/');
                }else{
                    if(result.length > 0){
                        req.session.user = user;
                        con.query('select classTitleId, classExp from Classes, Accounts where Accounts.accountUser = ? and Accounts.accountId = Classes.accountId',
                            [user],function(err, result){
                                if(err){
                                    console.log('QUERY ERROR');
                                    console.log(err.code);
                                    res.redirect('/');
                                }else{
                                    req.session.stats = JSON.stringify(result);
                                    console.log(req.session.stats);
                                    res.redirect('/');
                                }
                            });
                        //res.redirect('/');
                        //res.render('login', { title: 'PlayDuctive', proj: null, user: req.session.user});
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
    con.query('select Projects.* from Projects, Accounts, AccountProjects where Accounts.accountUser = ? and AccountProjects.accountId = Accounts.accountId and Projects.projId = AccountProjects.projId'
        , [req.session.user], function(err, result){
            if(err){
                console.log('QUERY ERROR');
                console.log(err.code);
                res.redirect('/');
            }else{
                for(var i = 0; i < result.length; i++){
                    console.log(result[0]);
                }  
            }   
        });
	res.render('login', { title: 'PlayDuctive', proj: null, stats: req.session.stats, user: req.session.user});
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
                res.render('login', {title: 'PlayDuctive', proj: null, success: "success", user: req.session.user});
            }
        }
    );
});
//ajax call to check valid users
router.post('/login/usetest', function(req,res){
    var user = req.query.user;  
    con.query('select accountId from Accounts where accountUser = ?', [user],
        function (err, result) {
            resultNum = 0;
            if (err) {
                console.log(err.code);
            } else {
                if(result.length > 0 || user == ''){
                    console.log(result.length);
                    req.session.user = user
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
    res.render('makeProject',{ title: 'PlayDuctive',stats: req.session.stats, user: req.session.user});
});

router.post('/makeProject/posts', function (req, res) {
    console.log(req.body);
    var accountName = req.session.user;
    var projType = req.body.projType;
    //var status = req.body.status; //default to incomplete
    var projName = req.body.projName;
    var projDesc = req.body.projDesc;
    var userList = req.body["addedUsers[]"];
    if(!userList) {
        userList=[];
    } else if(typeof userList != "object") {
        userList=[userList];
    }
    userList.push(accountName);

    //insert validation of values here(types, length requirement, etc.)
    if(!accountName){
        console.log(req.session.user);
        console.log(accountName);
        res.redirect('/');
    } else{
        var status = con.query('CALL createProject(?,?,?,?,?,@newProjId);', 
            [projType, "NOT-STARTED", projName, projDesc, accountName],
            function(err, result){
                console.log("yo1");
                con.query('SELECT @newProjId AS newProjId;',
                    function(err, result){
                        console.log("yo2");
                        for(var i = 0; i < userList.length; i++){
                            con.query('CALL addAccountProject(?,?);', 
                            [userList[i],result[0].newProjId],
                            function(err, result){});  
                        }
                });
        });
        res.render('makeProject',{ title: 'PlayDuctive',stats: req.session.stats, succes: status, user: req.session.user});
    }
});

router.post('/makeProject/search_users', function (req, res) {
    var userPartial=req.body.userPartial;
    //insert validation of values here(types, length requirement, etc.)

    con.query('SELECT accountUser FROM Accounts WHERE SUBSTRING(accountUser,1,?)=?;', 
        [userPartial.length,userPartial],
        function(err, result){
            userList=[];
            for(var i = 0; i < result.length; i++){
                userList.push([result[i].accountUser]);
            }
            res.json(JSON.stringify(userList));
        });
});

//Project stuff
router.post('/project', function(req,res){
    var projId = req.body.projectId;
    if(!req.session.user){
        redirect('/');
    }else{
        con.query('select ProjTypes.projTypeName as type, Projects.projName as project from Projects, ProjTypes where Projects.projId = ? and ProjTypes.projTypeId = Projects.projTypeId', 
        [projId],
        function (err, result){
            if(result[0].type = "AGILE"){
                res.render('agile', {title: 'PlayDuctive',stats: req.session.stats, user: req.session.user, projId: projId, projName: result[0].project});
            }else{
                res.send("waterfall");
            }
        });
    }
});

router.get('/makeTask', function(req,res){
    var projId = req.body.projId;
    if(!req.session.user){
        redirect('/');
    }else{
        con.query('select Accounts.accountUser as name, Projects.projName as project from AccountProjects, Accounts, Projects where Projects.projId = ? and AccountProjects.projId = ? and Accounts.accountId = AccountProjects.accountId',
            [projId, projId], 
            function(err, result){
                if(err){
                    res.redirect('/');
                }
                if(result.length > 1){
                    var userList = [];
                    var projName = result[0].project;
                    for(var i = 0; i < result.length; i++){
                        userList.push(result[i].name);
                    }
                    console.log(userList);
                    res.render('makeTask',{title: 'PlayDuctive', users: userList, stats: req.session.stats, user: req.session.user, projId: projId, projName: result[0].project})
                }else{
                    //there has to be an account user
                    console.log(err);
                    res.redirect('/');
                }
            });
    }
});

module.exports = router;