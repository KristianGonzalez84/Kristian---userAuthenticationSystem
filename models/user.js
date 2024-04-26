module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        userId: {
            type: Sequelize.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        fullName: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
        },

        username: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        EncryptedPassword: {
            type: Sequelize.DataTypes.BLOB,
            allowNull: false
        },

        Salt: {
            type: Sequelize.DataTypes.BLOB,
            allowNull: false
        },
    }, {
        timestamps: false
    });

    return User;
};