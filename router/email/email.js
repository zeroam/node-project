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
// DB 접속
connection.connect();

router.post("/form", function(req, res) {
  // 데이터 받기
  // get : req.param('email');
  let data = req.body.email;
  // res.send(`post, data:${data}`);
  res.render('email.ejs', {'email': req.body.email});
});

router.post("/ajax", function(req, res) {
  var email = req.body.email;
  console.log(`send data: ${email}`);
  var responseData = {};
  // 쿼리문 - 비동기로 동작
  var query = connection.query(`select * from JB_MEMBER where email='${email}'`, function(err, rows) {
    if(err) throw err;
    if(rows[0]) {
      responseData = rows[0];
      responseData.result = "ok";
    } else {
      responseData.result = "none";
      responseData.name = "";
    }
    res.json(responseData);
  });
});

module.exports = router;
