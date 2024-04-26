const express = require('express');
const router = express.Router();
const db = require('../models');
const passport = require('passport');
const UserService = require('../services/UserService');
const userService = new UserService(db);

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
        const user = await userService.getOne(userId);
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

        // Generate salt and hashed password
        const salt = crypto.randomBytes(16);
        const hashedPassword = await hashPassword(password, salt);

        // Call the UserService to create a new user
        const newUser = await userService.create(username, fullName, salt, hashedPassword);

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
        const user = await userService.getOne(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await userService.update(userId, updatedUserData);
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete user by ID
router.delete('/:userId', async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const user = await userService.getOne(userId);
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