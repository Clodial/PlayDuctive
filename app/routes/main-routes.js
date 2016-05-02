var express     = require('express');
var bodyParser  = require('body-parser');
var path 	    = require('path');
var mysql 	    = require('mysql');
//var session     = require('express-session');
//var mysqlStore  = require('express-mysql-session')(session);
var sendgrid = require("sendgrid")(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);

//database connection stuff
var con = mysql.createConnection(process.env.JAWSDB_URL);
var router 	= express.Router();

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//Index page route
router.get('/', function(req,res){
    if(!req.session.user){
	   res.render('index', { title: 'PlayDuctive', proj: null, user: null});
    }else{
        con.query('select Projects.projId as id, Projects.projName as name, Statuses.statusName as status from Projects, Statuses, Accounts, AccountProjects  where Accounts.accountUser = ? and AccountProjects.accountId = Accounts.accountId  and AccountProjects.projId = Projects.projId and Projects.statusId = Statuses.statusId;', [req.session.user],
            function(err, result){
                if(err) {
                    console.log("SQL ERROR WHILE GETTING PROJECTS")
                    console.log(err.code)
                } else{
                    var projList = [];
                    if(result) {
                        projList = result;
                    }
                    res.render('login', { title: 'PlayDuctive', proj: projList, stats: req.session.stats, user: req.session.user});
                }
            });
    }
});

router.get('/logCheck', function(req,res){
    var user = req.query.user;
    var pass = req.query.pass;
    if(!req.session.user){
        con.query('select Accounts.accountId from Accounts where accountUser = ? and accountPass = ?', [user,pass],
            function(err,result){
                if(err){
                    console.log('SQL ERROR WHILE CHECKING CREDENTIALS');
                    console.log(err.code);
                    res.redirect('/');
                }else{
                    if(result.length > 0){
                        req.session.user = user;
                        con.query('select classTitleId, classExp from Classes, Accounts where Accounts.accountUser = ? and Accounts.accountId = Classes.accountId;',
                            [user],function(err, result){
                                if(err){
                                    console.log('SQL ERROR WHILE RETRIEVING STATS');
                                    console.log(err.code);
                                    res.redirect('/');
                                }else{
                                    req.session.stats = JSON.stringify(result);
                                    res.redirect('/');
                                }
                            });
                        //res.redirect('/');
                        //res.render('login', { title: 'PlayDuctive', proj: null, user: req.session.user});
                    }else{
                        console.log('LOGCHECK: USER NOT FOUND')
                        //console.log(req.session.user);
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
    //console.log(req.session.user);
    con.query('select Projects.projId as id, Projects.projName as name, Statuses.statusName as status from Projects, Statuses, Accounts, AccountProjects  where Accounts.accountUser = ? and AccountProjects.accountId = Accounts.accountId  and AccountProjects.projId = Projects.projId and Projects.statusId = Statuses.statusId;'
        , [req.session.user], function(err, result){
            if(err){
                console.log('SQL ERROR WHILE GETTING PROJECTS');
                console.log(err.code);
                res.redirect('/');
            }else{
                projList=result;
            }   
        });
	res.render('login', { title: 'PlayDuctive', proj: projList, stats: req.session.stats, user: req.session.user});
});

//Login functionality
router.post('/login', function(req, res){
    var user = req.body.user;
    var email = req.body.email;
    var pass = req.body.pass;
    con.query('CALL createAccount(?,?,?)', [user, pass, email],
        function (err, result) {
            if (err) {
                console.log('SQL ERROR WHILE CREATING ACCOUNT');
                console.log(err.code);
                res.redirect('/');
            } else {
                console.log("success: " + true);
                
                res.redirect('/logCheck?user='+user+'&pass='+pass);
            }
        }
    );
    sendgrid.send({
      to:email,
      from:"no-reply@playductive.herokuapp.com",
      subject:"You've just joined PlayDuctive, the project management system that brings your D&D nights to your desk!",
      text:"Welcome to PlayDuctive! To access your account, go to https://playductive.herokuapp.com"
    }, function(err, json) {
      if (err) { return console.error(err); }
      console.log(json);
    });
});

//ajax call to check if a username is available
router.post('/login/usetest', function(req,res){
    var user = req.body.user;  
    con.query('select accountId from Accounts where accountUser = ?;', [user],
        function (err, result) {
            resultNum = 0;
            if (err) {
                console.log("SQL ERROR WHILE CHECKING USERNAME AVAILABILITY")
                console.log(err.code);
            } else {
                if(result.length > 0 || user == ''){
                    res.send(JSON.stringify("invalid"));
                }else{
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
    var accountName = req.session.user;
    var projType = req.body.projType;
    //var status = req.body.status; //default to NOT-STARTED
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
                if(err){console.log("SQL ERROR WHILE CREATING PROJECT");console.log(err.code);
                } else{
                    con.query('SELECT @newProjId AS newProjId;',
                        function(err, result){
                            if(err) {console.log("SQL ERROR RETRIEVING NEW PROJECT ID");console.log(err.code);}
                            for(var i = 0; i < userList.length; i++){
                                con.query('CALL addAccountProject(?,?);', 
                                [userList[i],result[0].newProjId],
                                function(err, result){
                                    if(err) {console.log("SQL ERROR WHILE ADDING ACCOUNT TO PROJECT");console.log(err.code);}
                                }); 
                                if(userList[i]!=req.session.user) {
                                    con.query('SELECT accountEmail AS accountEmail FROM Accounts WHERE accountUser=?;', 
                                        [userList[i]],
                                        function(err, result){
                                            if(err) {console.log("SQL ERROR WHILE RETRIEVING EMAIL ADDRESS");console.log(err.code);
                                            }else {
                                                if(result!=false){
                                                    sendgrid.send({
                                                      to:result[0].accountEmail,
                                                      from:"no-reply@playductive.herokuapp.com",
                                                      subject:"You've just been added to a project on PlayDuctive!",
                                                      text:"Someone has added you to a project on PlayDuctive! To see the project, go to https://playductive.herokuapp.com"
                                                    }, function(err, json) {
                                                      if (err) { return console.error(err); }
                                                      console.log(json);
                                                    });
                                                }
                                            }
                                        }); 
                                }
                            }
                    });
                }
        });
        res.redirect('/')
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

// router.post('/email/test', function (req, res) {
//     var emailTo=req.body.emailTo;
//     var emailFrom=req.body.emailFrom;
//     var subject=req.body.subject;
//     var html=req.body.html;

    // sendgrid.send({
    //   to:emailTo,
    //   from:emailFrom,
    //   subject:subject,
    //   text:html
    // }, function(err, json) {
    //   if (err) { return console.error(err); }
    //   console.log(json);
    // });

//     res.redirect('/');
// });

//Project stuff
router.get('/project', function(req,res){
    var projId = req.query.projectId;
    if(!req.session.user){
        res.redirect('/');
    }else{
        con.query('select ProjTypes.projTypeName as type, Projects.projName as project from Projects, ProjTypes where Projects.projId = ? and ProjTypes.projTypeId = Projects.projTypeId', 
        [projId],
        function (err, result){
            if(result[0].type == "Agile"){
                var status = con.query('SELECT AccountTasks.statusId as statid, AccountTasks.taskExp as exp, AccountTasks.taskDesc as description from AccountTasks where AccountTasks.projId = ?',
                        [projId] , 
                    function (err, result2){    
                        if(err){
                            console.log(err);
                            res.redirect('/');
                        } else {
                            if(result2){
                                var stStatids = JSON.stringify(result2);
                                res.render('agile',{title: 'PlayDuctive', statusinfo: stStatids, stats: req.session.stats, user: req.session.user, projId: projId, projName: result[0].project});
                            }else{
                                res.redirect('/');
                            }
                        }
                    });
                //res.render('agile', {title: 'PlayDuctive',stats: req.session.stats, user: req.session.user, projId: projId, projName: result[0].project});
            }else{
                var status = con.query('SELECT AccountTasks.taskId as taskId, Statuses.statusName as statusName, AccountTasks.taskExp as taskExp, AccountTasks.taskDesc as taskDesc from AccountTasks,Statuses where AccountTasks.projId = ? AND AccountTasks.statusId=Statuses.statusId;',
                        [projId] , 
                    function (err, result2){    
                        if(err){
                            console.log(err);
                            res.redirect('/');
                        } else {
                            if(result2){
                                var stStatids = JSON.stringify(result2);
                                res.render('waterfall',{title: 'PlayDuctive', statusinfo: stStatids, stats: req.session.stats, user: req.session.user, projId: projId, projName: result[0].project});
                            }else{
                                res.redirect('/');
                            }
                        }
                    });
            }
        });
    }
});

//Task Creation and Management
router.get('/makeTask', function(req,res){
    var projId = req.query.projId;
    req.session.projId=projId;
    //console.log(projId);
    if(!req.session.user){
        redirect('/');
    }else{
        con.query('select Accounts.accountUser as name, Projects.projName as project from AccountProjects, Accounts, Projects where Projects.projId = ? and AccountProjects.projId = ? and Accounts.accountId = AccountProjects.accountId',
            [projId, projId], 
            function(err, result){
                //console.log(result[0]);
                if(err){
                    res.redirect('/');
                }
                if(result.length > 0){
                    var userList = [];
                    var projName = result[0].project;
                    for(var i = 0; i < result.length; i++){
                        //console.log(result[i].name);
                        userList.push(result[i].name);
                    }
					//alan's agile status query work in progress
                    //console.log(userList);
                    res.render('makeTask',{title: 'PlayDuctive', users: userList, stats: req.session.stats, user: req.session.user, projId: projId, projName: result[0].project})
                }else{
                    //there has to be an account user
                    console.log(err);
                    res.redirect('/');
                }
            });
    }
});

router.post('/makeTask/posts', function (req, res) {
	var projId = req.session.projId;
    var accountName = req.session.user;
    var classTitle = req.body.classTitle;
    var taskExp = req.body.taskExp;
    var taskDesc = req.body.taskDesc;

    //insert validation of values here(types, length requirement, etc.)
    if(!accountName){
        console.log(req.session.user);
        console.log(accountName);
        res.redirect('/');
    }else{
        console.log([accountName, classTitle, taskDesc, taskExp, projId])
		var makingTask = con.query('CALL createTask2(?,?,?,?,?,@newTaskId);', 
		[accountName, classTitle, taskDesc, taskExp, projId],
        function(err, result){
			if(err){
				console.log(err);
			}else{
				con.query('SELECT @newTaskId AS newTaskId;',
					function(err, result){
						if(err){
							console.log("SQL ERROR RETRIEVING NEW PROJECT ID");
							console.log(err.code);
						}else{
                            console.log("NEW TASK ID")
							console.log(result[0].newTaskId);
						}
					});
			}
		});
        res.redirect('/project?projectId='+projId);
    }
});

router.post('/tasks/completeTask', function (req, res) {
    var projId = req.body.projId;
    var taskId = req.body.taskId;
    var accountName = req.session.user;

    //insert validation of values here(types, length requirement, etc.)
    if(!accountName){
        console.log(req.session.user);
        console.log(accountName);
        res.redirect('/');
    }else{
        con.query('UPDATE AccountTasks SET statusId=(SELECT statusId FROM Statuses WHERE statusName="COMPLETE") WHERE taskId=?;', 
        [taskId],
        function(err, result){
            if(err){
                console.log(err);
                res.redirect('/project?projectId='+projId);
            }else{
                res.redirect('/project?projectId='+projId);
            }
        });
    }
});

module.exports = router;