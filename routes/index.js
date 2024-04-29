const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/authentication');

const db = require('../models');
const UserService = require('../services/UserService');
const userService = new UserService(db);

// Render the login page
router.get('/', function (req, res, next) {
  res.render('login', { title: 'Login' });
});

// Render the signup page
router.get('/signup', function (req, res, next) {
  res.render('signup', { title: 'Sign Up' });
});

router.get('/access', isAuthenticated,async function (req, res, next) {
  try {
    const user = await userService.getOneById(req.user.userId);
    const username = user.username;

    res.render('access', { title: 'Access', username: username });
  } catch (err) {
    console.err(err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;