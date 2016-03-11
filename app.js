// app.js

// modules ======================================
/*var express 		= require('express');
var app				= express();
var bodyParser		= require('body-parser');
var methodOverride	= require('method-override');

// configuration ===============================

var port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.get('*', function(req,res){
		res.sendFile(__dirname + '/public/view/index.html');
})

app.listen(8080);
//

*/
var express = require('express');
var app = express();
app.get ('/', function(req, res){
	res.send('Hello');
});

app.listen(8080, function(){
	console.log('bleeegh');
});