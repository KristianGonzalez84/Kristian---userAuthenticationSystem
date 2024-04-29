const crypto = require('crypto');

class UserService {
    constructor(db) {
        this.client = db.sequelize;
        this.User = db.User;
    }

    async create(username, firstname, lastname, encryptedPassword, salt) {
        try {
            const fullName = `${firstname} ${lastname}`;
            const newUser = await this.User.create({
                username: username,
                fullName: fullName,
                EncryptedPassword: encryptedPassword,
                Salt: salt
            });
            console.log('User created successfully:', newUser);
            return newUser;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async getAll() {
        return this.User.findAll();
    }

    async getOneById(userId) {
        return this.User.findOne({
            where: { userId: userId }
        });
    }

    async getOneByUsername(username) {
        return this.User.findOne({
            where: { username: username }
        });
    }

    async update(userId, updatedUserData) {
        try {
            const user = await this.User.findOne({ where: { userId: userId } });
            if (!user) {
                throw new Error('User not found');
            }
    
            // Update user data
            const { username, firstname, lastname, encryptedPassword, salt } = updatedUserData;
            const fullName = `${firstname} ${lastname}`;
    
            user.username = username;
            user.fullName = fullName;
            user.EncryptedPassword = encryptedPassword;
            user.Salt = salt;
    
            // Save the updated user
            await user.save();
    
            return user;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    async deleteUser(userId) {
        return this.User.destroy({
            where: { userId: userId }
        });
    }

    hashPassword(password, salt) {
        return crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256');
    }
}

module.exports = UserService;