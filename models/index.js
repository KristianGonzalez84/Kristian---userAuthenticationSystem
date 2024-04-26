const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
require('dotenv').config();

const connection = {
  dialect: process.env.DIALECT,
  dialectModel: process.env.DIALECTMODEL,
  database: process.env.DATABASE_NAME,
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
  host: process.env.HOST
};

// Connect to the database
const sequelize = new Sequelize(connection);
console.log('You are connected!');

const db = {};
db.sequelize = sequelize;

// Load models from files in the same directory
fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) &&
      (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize);
    db[model.name] = model;
  });

module.exports = db