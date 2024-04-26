class UserService {
    constructor(db) {
        this.client = db.sequelize;
        this.User = db.User;
    }

    async create(username, firstname, lastname, salt, hashedPassword) {
        try {
            const fullName = `${firstname} ${lastname}`;
            const newUser = await this.User.create({
                username: username,
                fullName: fullName,
                EncryptedPassword: hashedPassword,
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