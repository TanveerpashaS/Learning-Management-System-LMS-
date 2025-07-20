const db = require('../models'); // Sequelize or DB connection

// ✅ Get enrolled courses for a student
exports.getStudentCourses = async (req, res) => {
  const { studentId } = req.params;

  try {
    const [courses] = await db.sequelize.query(
      `SELECT c.id, c.title, c.description, e.progress
       FROM Courses c
       JOIN Enrollments e ON e.course_id = c.id
       WHERE e.user_id = ?`,
      { replacements: [studentId] }
    );
    res.json(courses);
  } catch (err) {
    console.error('Error fetching student courses:', err);
    res.status(500).json({ message: 'Error fetching courses' });
  }
};

// ✅ Get available (unenrolled) courses for a student
exports.getAvailableCourses = async (req, res) => {
  const { studentId } = req.params;

  try {
    const [availableCourses] = await db.sequelize.query(
      `SELECT c.id, c.title, c.description, u.username AS instructorName
       FROM Courses c
       JOIN Users u ON c.instructor_id = u.id
       WHERE c.id NOT IN (
         SELECT course_id FROM Enrollments WHERE user_id = ?
       )`,
      { replacements: [studentId] }
    );

    res.status(200).json(availableCourses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch available courses', error: err.message });
  }
};

// ✅ Update progress
exports.updateProgress = async (req, res) => {
  const { user_id, course_id, progress } = req.body;
  try {
    await db.query(
      'UPDATE Enrollments SET progress = ? WHERE user_id = ? AND course_id = ?',
      { replacements: [progress, user_id, course_id] }
    );
    res.status(200).json({ message: 'Progress updated' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update progress', error: err.message });
  }
};
