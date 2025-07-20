const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

exports.getStudentDashboard = async (req, res) => {
  const userId = req.params.id;

  try {
    const enrollments = await Enrollment.findAll({
      where: { user_id: userId },
      include: [{ model: Course }]
    });

    res.json({ enrollments });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching dashboard data', error: err.message });
  }
};
