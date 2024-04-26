const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/authentication');

// Render the login page
router.get('/', function (req, res, next) {
  res.render('login', { title: 'Login' });
});

// Render the signup page
router.get('/signup', function (req, res, next) {
  res.render('signup', { title: 'Sign Up' });
});

router.get('/access', isAuthenticated, function (req, res, next) {
  res.render('access', { title: 'Access' });
});

module.exports = router;