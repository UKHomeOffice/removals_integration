var express = require('express');
var mysql = require('mysql');

var router = express.Router();

var pool = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'Bad'
});

/* GET home page. */
router.get('/', function(req, res, next) {
  pool.getConnection(function(err, connection) {
    connection.query( 'SELECT * FROM Centres', function(err, rows) {
        connection.release();

        res.render('index', { title: 'IRC Bed Management', data: rows });
      });
  });
});

module.exports = router;
