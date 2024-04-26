const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const db = require("../models");
const UserService = require("../services/UserService");
const userService = new UserService(db);

// Passport initialization
passport.use(new LocalStrategy(function verify(username, password, cb) {
  userService.getOneByUsername(username)
    .then((user) => {
      if (!user) {
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
      crypto.pbkdf2(password, user.Salt, 310000, 32, 'sha256', function(err, hashedPassword) {
        if (err) { return cb(err); }
        if (!crypto.timingSafeEqual(user.EncryptedPassword, hashedPassword)) {
          return cb(null, false, { message: 'Incorrect username or password.' });
        }
        return cb(null, user);
      });
    })
    .catch((err) => cb(err));
}));

passport.serializeUser(function(user, cb) {
  cb(null, user.userId);
});

passport.deserializeUser(function(userId, cb) {
  userService.getOneById(userId)
    .then(user => {
      if (!user) {
        return cb(new Error('User not found'));
      }
      cb(null, user);
    })
    .catch(err => {
      cb(err);
    });
});

// Login route
router.post('/login', passport.authenticate('local', {
  successReturnToOrRedirect: '/access',
  failureRedirect: '/',
  failureMessage: true
}));

// Logout route
router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

// Signup route
router.post('/signup', function(req, res, next) {
  console.log('Received signup request:', req.body); // Log the form data received
  const salt = crypto.randomBytes(16);
  crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
    if (err) { return next(err); }
    userService.create(req.body.username, req.body.firstname, req.body.lastname, salt, hashedPassword)
      .then(() => {
        res.redirect('/');
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Internal Server Error');
      });
  });
});

module.exports = router;