var express = require('express');
var router = express.Router();
var path = require('path');
var mysql = require('mysql');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// DB 접속 정보
var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'asdf1234',
  database: 'jsman'
});

connection.connect();

router.get("/", function(req, res) {
  var msg;
  var errMsg = req.flash('error');
  if(errMsg) msg = errMsg;
  res.render('join.ejs', {'message': msg});
});

passport.serializeUser((user,done) => {
  console.log('passport session save : ', user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log('passport session get id: ', id);
  done(null, id);
});

passport.use('local-join', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  console.log('local-join callback called');
  // dealing login authentication
  var query = connection.query('select * from user where email=?', [email], (err, rows) => {
    if(err) return done(err);
    // check be duplicated
    if(rows.length) {
      console.log('existed user');
      return done(null, false, {message: 'your email is already used'})
    // can join
    } else {
      var sql = {email:email, pw:password}
      var query = connection.query('insert into user set ?', sql, (err, rows) => {
        if(err) throw err;
        return done(null, {'email':email, 'id':rows.insertId});
      });
    }
  });
}));

router.post('/', passport.authenticate('local-join', {
  successRedirect: '/main',
  failureRedirect: '/join',
  failureFlash: true
}));

// router.post("/", function(req, res) {
//   var body = req.body;
//   var email = body.email;
//   var name = body.name;
//   var passwd = body.password
//
//   var sql = {email:email, name:name, pw:passwd}
//   var query = connection.query(`insert into user set ?`, sql, (err, rows) => {
//     if(err) throw err;
//     else res.render('welcome.ejs', {name:name, id:rows.insertId});
//   })
// });

module.exports = router;
