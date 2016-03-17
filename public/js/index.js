
var mysql = require("mysql");

console.log('test');

console.log(mysql.createConnection(process.env.JAWSDB_URL));