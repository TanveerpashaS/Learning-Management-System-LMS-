// backend/server.js
require('dotenv').config();
const express      = require('express');
const bodyParser   = require('body-parser');
const cors         = require('cors');
const sequelize    = require('./config/db');

// Import routes
const authRoutes       = require('./routes/authRoutes');
const userRoutes       = require('./routes/userRoutes');
const courseRoutes     = require('./routes/courseRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const studentRoutes    = require('./routes/studentRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mount routes
app.use('/api/auth',       authRoutes);
app.use('/api/users',      userRoutes);
app.use('/api/courses',    courseRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/enrollment', enrollmentRoutes);
app.use('/api/courses', studentRoutes);

// If using Sequelize models, define relations here (optional)
const User       = require('./models/User');
const Course     = require('./models/Course');
const Enrollment = require('./models/Enrollment');

Course.belongsTo(User,       { foreignKey: 'instructor_id' });
Enrollment.belongsTo(Course, { foreignKey: 'course_id' });
Enrollment.belongsTo(User,   { foreignKey: 'user_id' });

// Sync and start
sequelize.sync({ force: false })
  .then(() => {
    console.log('✅ Database synchronized.');
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
  })
  .catch(err => console.error('❌ Error syncing database:', err.message));
