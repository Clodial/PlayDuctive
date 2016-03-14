var mysql = require('mysql');

function runQuery(query){

	var connect = mysql.createConnection(process.env.JAWSDB_URL);

	connect.query(query);

	connect.end();

}
