const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Course = sequelize.define('Course', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  instructor_id: { type: DataTypes.INTEGER }
});
Course.associate = (models) => {
  Course.hasMany(models.Enrollment, { foreignKey: 'course_id' });
};

module.exports = Course;
