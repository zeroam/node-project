var express = require('express');
var router = express.Router();
var path = require('path');
var mysql = require('mysql');

// DB 접속 정보
var connection = mysql.createConnection({
  host: 'zeroam.iptime.org',
  port: 3306,
  user: 'jcw',
  password: '1234',
  database: 'jboard2'
});

connection.connect();

router.get("/", function(req, res) {
  res.render('join.ejs');
});

router.post("/", function(req, res) {
  var body = req.body;
  var email = body.email;
  var name = body.name;
  var passwd = body.password

  var sql = {email:email, name:name, password:passwd}
  var query = connection.query(`insert into user set ?`, sql, (err, rows) => {
    if(err) throw err;
    else res.render('welcome.ejs', {name:name, id:rows.insertId});
  })
});

module.exports = router;
