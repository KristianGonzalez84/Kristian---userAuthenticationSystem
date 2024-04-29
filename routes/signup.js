
const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const db = require("../models");
const UserService = require("../services/UserService");
const userService = new UserService(db);

// Render the signup page
router.get('/', function (req, res, next) {
    res.render('signup', { title: 'Sign Up' });
});

// Signup route
router.post('/', function(req, res, next) {
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