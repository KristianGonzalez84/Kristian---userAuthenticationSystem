const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models');

// Passport configuration
passport.use(new LocalStrategy(async function(username, password, done) {
  try {
    // Find user by username
    const user = await User.findOne({ where: { username } });

    // If user not found or password doesn't match
    if (!user || user.password !== password) {
      return done(null, false, { message: 'Incorrect username or password.' });
    }

    // If user found and password matches
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Serialization and deserialization functions for Passport
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const router = express.Router();

router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/access',
  failureRedirect: '/login',
  failureFlash: true
}));

router.post('/signup', async (req, res) => {
  try {
    // Extract user data from the request body
    const { username, firstname, lastname, password } = req.body;

    // Check if the username already exists in the database
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).send('Username already exists');
    }

    // Create a new user instance with all required fields
    const newUser = await User.create({
      username,
      fullName: `${firstname} ${lastname}`,
      password,
    });

    // Redirect the user to the login page after successful signup
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;