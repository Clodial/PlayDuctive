// app.js

// modules ======================================
var express 		= require('express');
var app				= express();
var adRouter		= express.Router();
var logger 			= require('morgan');
var bodyParser		= require('body-parser');
var methodOverride	= require('method-override');
var path 			= require('path');
var http			= require('http');
var fs 				= require('fs');
var mysql           = require('mysql');

// configuration ===============================

app.set('port', (process.env.PORT || 1337));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/', function(req,res){
	res.sendFile(path.join(__dirname + '/public/view/index.html'));
});

app.get('/create_project.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/view/create_project.html'));
});

app.get('/create_project.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/app/components/create_project.js'));
});

//create a connection
var connection = mysql.createConnection(process.env.JAWSDB_URL);

function runQuery(query, paramList) {
    /**
    * @ Runs an arbitrary query with arbitrary parameters
    * @ query: A MySQL query, with ? for the parameters
    * @ paramList: A list of parameter values that line up with the query
    */
    
    //don't need to connect twice in node-mysql
    ////connect to the database
    //connection.connect(function (err) {
    //    if (err) {
    //        console.log('CONNECTION ERROR');
    //        console.log(err.code);
    //    }
    //});

    //query the database
    connection.query(query, paramList,
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

app.post('/create_project/posts', function (req, res) {
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

app.listen(app.get('port'));

module.exports = app;