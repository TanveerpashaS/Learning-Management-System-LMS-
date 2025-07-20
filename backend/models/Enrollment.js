const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Enrollment = sequelize.define('Enrollment', {
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  course_id: { type: DataTypes.INTEGER, allowNull: false },
  progress: { type: DataTypes.INTEGER, defaultValue: 0 }
});
Enrollment.associate = (models) => {
  Enrollment.belongsTo(models.User, { foreignKey: 'user_id' });
  Enrollment.belongsTo(models.Course, { foreignKey: 'course_id' });
};

module.exports = Enrollment;
