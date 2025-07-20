// models/index.js
const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const db = {};

// Import individual models
db.User = require('./User');
db.Course = require('./Course');
db.Enrollment = require('./Enrollment');

// Sequelize setup
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Set up associations (if defined in models)
if (db.User.associate) db.User.associate(db);
if (db.Course.associate) db.Course.associate(db);
if (db.Enrollment.associate) db.Enrollment.associate(db);

module.exports = db;
