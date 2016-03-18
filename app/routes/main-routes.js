var express = require('express');
var router 	= express();
var path 	= require('path');

//Index page route
router.get('/', function(req, res, next) {

  res.sendFile(path.join(__dirname + '../../../public/view/index.html'));

});

module.exports = router;