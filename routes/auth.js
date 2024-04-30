const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserService = require("../services/UserService");
const db = require('../models');
const userService = new UserService(db); // Assuming db is already defined
const crypto = require('crypto');

// Passport initialization
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
}, function(username, password, cb) {
  console.log('Received username:', username);
  console.log('Received password:', password);
  
  userService.getOneByUsername(username)
    .then((user) => {
      console.log('Found user:', user.username);
      if (!user) {
        console.log('User not found');
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
      
      // Hash the password provided during login
      const hashedPassword = userService.hashPassword(password, user.Salt).toString('hex');
      console.log('Hashed password:', hashedPassword);
      console.log('Stored password:', user.EncryptedPassword.toString('hex'));
      
      // Compare hashed passwords
      if (hashedPassword !== user.EncryptedPassword.toString('hex')) {
        console.log('Incorrect password');
        return cb(null, false, { message: 'Incorrect username or password.' });
      }
      
      console.log('Login successful');
      return cb(null, user);
    })
    .catch((err) => {
      console.error('Error:', err);
      cb(err);
    });
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.userId);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await userService.getOneById(userId);
    if (!user) {
      return done(new Error('User not found'));
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
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
router.post('/signup', async (req, res) => {
  try {
    const { username, firstname, lastname, password } = req.body;
    const salt = crypto.randomBytes(16).toString('hex');
    const encryptedPassword = userService.hashPassword(password, salt);
    await userService.create(username, firstname, lastname, encryptedPassword, salt);
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;