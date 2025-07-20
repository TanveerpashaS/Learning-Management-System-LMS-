// backend/controllers/courseController.js
const db = require('../config/db');

// Create a new course
exports.createCourse = async (req, res) => {
  const { title, description, category, level, duration, instructor_id } = req.body;
  try {
    await db.query(
      `INSERT INTO Courses
         (title, description, category, level, duration, instructor_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      { replacements: [title, description, category, level, duration, instructor_id] }
    );
    res.status(201).json({ message: 'Course created successfully' });
  } catch (err) {
    console.error('CreateCourse error:', err.message);
    res.status(500).json({ message: 'Error creating course', error: err.message });
  }
};

// Get all instructor's courses with stats
exports.getInstructorCourses = async (req, res) => {
  const instructorId = req.query.instructor_id;
  try {
    const [courses] = await db.query(
      `SELECT 
         c.id, c.title, c.description, c.category, c.level, c.duration,
         COUNT(e.user_id) AS total_students,
         COALESCE(AVG(e.progress), 0) AS avg_progress
       FROM Courses c
       LEFT JOIN Enrollments e ON c.id = e.course_id
       WHERE c.instructor_id = ?
       GROUP BY c.id
       ORDER BY c.id DESC`,
      { replacements: [instructorId] }
    );
    res.json(courses);
  } catch (err) {
    console.error('GetInstructorCourses error:', err.message);
    res.status(500).json({ message: 'Failed to fetch courses', error: err.message });
  }
};

// Update a course
exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description, category, level, duration } = req.body;
  try {
    await db.query(
      `UPDATE Courses
         SET title=?, description=?, category=?, level=?, duration=?
       WHERE id=?`,
      { replacements: [title, description, category, level, duration, id] }
    );
    res.json({ message: 'Course updated successfully' });
  } catch (err) {
    console.error('UpdateCourse error:', err.message);
    res.status(500).json({ message: 'Error updating course', error: err.message });
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(`DELETE FROM Courses WHERE id=?`, { replacements: [id] });
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error('DeleteCourse error:', err.message);
    res.status(500).json({ message: 'Error deleting course', error: err.message });
  }
};

// Enroll a student
exports.enrollInCourse = async (req, res) => {
  const { user_id, course_id } = req.body;
  try {
    await db.query(
      `INSERT INTO Enrollments (user_id, course_id, progress)
       VALUES (?, ?, 0)`,
      { replacements: [user_id, course_id] }
    );
    res.json({ message: 'Enrollment successful' });
  } catch (err) {
    console.error('EnrollInCourse error:', err.message);
    res.status(500).json({ message: 'Enrollment failed', error: err.message });
  }
};

// (Optional) Student’s enrolled courses
exports.getStudentCourses = async (req, res) => {
  const studentId = req.params.id;
  try {
    const [courses] = await db.query(
      `SELECT 
         c.id, c.title, c.description, u.username AS instructorName, e.progress
       FROM Enrollments e
       JOIN Courses c ON e.course_id = c.id
       JOIN Users u ON c.instructor_id = u.id
       WHERE e.user_id = ?`,
      { replacements: [studentId] }
    );
    res.json(courses);
  } catch (err) {
    console.error('GetStudentCourses error:', err.message);
    res.status(500).json({ message: 'Failed to fetch student courses', error: err.message });
  }
};
