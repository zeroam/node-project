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
  res.render('login.ejs', {'message': msg});
});

passport.serializeUser((user,done) => {
  console.log('passport session save : ', user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log('passport session get email: ', id);
  done(null, id);
});

passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  console.log('local-login callback called');
  // dealing login authentication
  var query = connection.query('select * from user where email=?', [email], (err, rows) => {
    if(err) return done(err);
    // check be duplicated
    if(rows.length) {
      console.log("query data : ",rows);
      return done(null, {'email':email, 'id':rows[0].uid});
    } else {
      return done(null, false, {message:'your login info is not found'});
    }
  });
}));

router.post('/', (req, res, next) => {
  passport.authenticate('local-login', (err, user, info) => {
    if(err) res.status(500).json(err);
    if(!user) return res.status(401).json(info.message);

    req.logIn(user, (err) => {
      if(err) return next(err);
      return res.json(user);
    });
  })(req,res,next);
});

module.exports = router;
