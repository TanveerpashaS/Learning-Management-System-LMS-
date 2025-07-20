// backend/controllers/enrollmentController.js
const db = require('../config/db');

// ─── List Course IDs the student is enrolled in ───────────────────────────────
exports.getStudentEnrollmentIds = async (req, res) => {
  const studentId = req.params.id;
  try {
    const [rows] = await db.query(
      `SELECT course_id FROM enrollments WHERE user_id = ?`,
      { replacements: [studentId] }
    );
    res.json(rows); // returns [{ course_id: 1 }, ...]
  } catch (err) {
    console.error('getStudentEnrollmentIds error:', err.message);
    res.status(500).json({ message: 'Failed to fetch enrollment IDs', error: err.message });
  }
};

// ─── List Available Courses (not enrolled) ────────────────────────────────────
exports.getAvailableCourses = async (req, res) => {
  const studentId = req.params.id;
  try {
    const [courses] = await db.query(`
      SELECT
        c.id,
        c.title,
        c.description,
        u.username AS instructorName
      FROM courses c
      JOIN users u ON c.instructor_id = u.id
      WHERE c.id NOT IN (
        SELECT course_id FROM enrollments WHERE user_id = ?
      )
      ORDER BY c.id DESC
    `, { replacements: [studentId] });
    res.json(courses);
  } catch (err) {
    console.error('getAvailableCourses error:', err.message);
    res.status(500).json({ message: 'Failed to fetch available courses', error: err.message });
  }
};

// ─── Enroll the student in a course ───────────────────────────────────────────
exports.enrollInCourse = async (req, res) => {
  const { user_id, course_id } = req.body;
  try {
    await db.query(
      `INSERT INTO enrollments (user_id, course_id, progress) VALUES (?, ?, 0)`,
      { replacements: [user_id, course_id] }
    );
    res.status(201).json({ message: 'Enrollment successful' });
  } catch (err) {
    console.error('enrollInCourse error:', err.message);
    res.status(500).json({ message: 'Enrollment failed', error: err.message });
  }
};
