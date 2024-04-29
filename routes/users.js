const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('passport');
const UserService = require('../services/UserService');
const userService = new UserService(db);
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// GET all users
router.get('/', async (req, res, next) => {
    try {
        const users = await userService.getAll();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET user by ID
router.get('/:userId', async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const user = await userService.getOneById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create a new user
router.post('/', async (req, res, next) => {
    const userData = req.body;
    try {
        // Extract username, fullName, password from request body
        const { username, fullName, password } = userData;

        // Hash the password using 
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const encryptedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Log the extracted values for debugging
        console.log('Extracted values:');
        console.log('Username:', username);
        console.log('Full Name:', fullName);
        console.log('Encrypted Password:', encryptedPassword);

        // Splitting full name into first and last name
        const [firstname, lastname] = fullName.split(' ');

        // Log the split names for debugging
        console.log('First Name:', firstname);
        console.log('Last Name:', lastname);

        // Call the UserService to create a new user
        const newUser = await userService.create(username, firstname, lastname, encryptedPassword, salt);

        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update user by ID
router.put('/:userId', async (req, res, next) => {
    const userId = req.params.userId;
    const updatedUserData = req.body;
    try {
        // Fetch the existing user
        const user = await userService.getOneById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Extract updated fields from request body
        const { username, firstname, lastname, password } = updatedUserData;

        // Hash the updated password
        const encryptedPassword = await bcrypt.hash(password, 10); // assuming 10 is the salt rounds

        // Extract salt from the existing user
        const salt = user.Salt;

        // Update user data
        const updatedUser = await userService.update(userId, {
            username,
            firstname,
            lastname,
            encryptedPassword,
            salt
        });

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete user by ID
router.delete('/:userId', async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const user = await userService.getOneById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await userService.deleteUser(userId);
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;