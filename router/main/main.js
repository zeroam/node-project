var express = require('express');
var router = express.Router();
// 상대경로 처리
var path = require('path');

// 라우터 된 경로
router.get("/", (req, res) => {
  console.log('main is loaded', req.user);
  var id = req.user;
  res.render('main.ejs', {'id':id});
  //res.sendFile(path.join(__dirname, '../../public/main.html'));
});

module.exports = router;
