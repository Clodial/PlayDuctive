//main-routes.js

var express = require('express');
var router  = express();

app.get('/', function(req,res){
	res.sendFile(path.join(__dirname + '/public/view/index.html'));
});