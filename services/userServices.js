const fs = require('fs');
const path = require('path');
const { sequelize } = require('../models');

async function populateUsersFromJSON() {
    try {
        const filePath = path.join(__dirname, '../public/json/users.json');
        const usersData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // Checks if users table is empty
        const [existingUsersCount] = await sequelize.query('SELECT COUNT(*) AS count FROM users');
        const usersCount = existingUsersCount[0].count;
        if (usersCount > 0) {
            console.log('Users table is not empty. Skipping population process.');
            return;
        }

        // Truncate the users table and reset auto-increment
        await sequelize.query('TRUNCATE TABLE users');
        await sequelize.query('ALTER TABLE users AUTO_INCREMENT = 1');

        // Insert users from JSON data using raw SQL queries
        for (const user of usersData) {
            await sequelize.query(user.query);
        }

        console.log('Users populated successfully.');
    } catch (error) {
        console.error('Error populating users:', error);
    }
}

module.exports = { populateUsersFromJSON };