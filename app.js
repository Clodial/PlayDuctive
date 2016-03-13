// app.js

// modules ======================================
var express 		= require('express');
var app				= express();
var adRouter		= express.Router();
var logger 			= require('morgan');
var bodyParser		= require('body-parser');
var methodOverride	= require('method-override');
var http			= require('http');
var fs 				= require('fs');

// configuration ===============================

console.log("yo");

