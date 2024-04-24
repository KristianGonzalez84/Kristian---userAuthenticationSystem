const express = require('express');
const router = express.Router();
const passport = require('passport');
const isAuthenticated = require('../middleware/authentication');
const { User } = require('../models');

// Render the login page
router.get('/', function (req, res, next) {
  res.render('login', { title: 'Login', user: req.user });
});

// Render the signup page
router.get('/signup', function (req, res, next) {
  res.render('signup', { title: 'Sign Up', user: req.user });
});

router.post('/signup', function (req, res, next) {
  res.render('signup', { title: 'Sign Up', user: req.user});
});

// Logout route
router.post('/logout', (req, res) => {
  console.log('Logging out user:', req.user); // Log user being logged out
  console.log('Session before logout:', req.session); // Log session before logout
  // clear session
  req.session.user = null;
  // Destroy session
  req.session.destroy((err) => {
    if (err) {
      console.log('Error destroying session:', err);
    }
  });
  res.redirect('/');
});

// Access page (GET)
router.get('/access', isAuthenticated, function (req, res, next) {
  // Access session data
  const user = req.session.user;
  res.render('access', { title: 'Access Page', user: req.user });
});

// Redirect after successful login
router.post('/login', (req, res, next) => {
  console.log('Login request received');
  passport.authenticate('local', (err, user, info) => {
      if (err) {
          console.error('Error during authentication:', err);
          return next(err);
      }
      if (!user) {
          console.log('Authentication failed');
          return res.redirect('/');
      }
      req.logIn(user, (err) => {
          if (err) {
              console.error('Error logging in user:', err);
              return next(err);
          }
          console.log('User logged in successfully');
          return res.redirect('/access');
      });
  })(req, res, next);
});



module.exports = router;