var express = require('express');
var router	= express();
var path	= require('path');

router.get('/', function(req, res){

	res.send('gotchaman');

});

router.post('/', function(req, res){

	res.send('yolo');

})

module.exports = router;