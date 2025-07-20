// backend/testDB.js
const sequelize = require('./config/db');

sequelize.authenticate()
    .then(() => console.log('✅ Database test connection successful.'))
    .catch((err) => console.error('❌ Database connection error:', err.message));
