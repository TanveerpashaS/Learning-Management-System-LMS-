const db = require('../config/db');

// Create a new course
exports.createCourse = async (req, res) => {
  const { title, description, instructor_id } = req.body;
  try {
    await db.query(
      'INSERT INTO Courses (title, description, instructor_id) VALUES (?, ?, ?)',
      { replacements: [title, description, instructor_id] }
    );
    res.status(201).json({ message: 'Course created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating course', error: err.message });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    await db.query(
      'UPDATE Courses SET title = ?, description = ? WHERE id = ?',
      { replacements: [title, description, id] }
    );
    res.status(200).json({ message: 'Course updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating course', error: err.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM Courses WHERE id = ?', { replacements: [id] });
    res.status(200).json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting course', error: err.message });
  }
};

// Get all courses (for student to explore)
exports.getAllCourses = async (req, res) => {
  try {
    const [courses] = await db.query(`
      SELECT c.id, c.title, c.description, u.username AS instructorName
      FROM Courses c JOIN Users u ON c.instructor_id = u.id
    `);
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch courses', error: err.message });
  }
};

// Enroll student in course
// Enroll student in course (with duplicate check)
exports.enrollInCourse = async (req, res) => {
  const { user_id, course_id } = req.body;
  try {
    // Check if already enrolled
    const [existing] = await db.query(
      'SELECT * FROM Enrollments WHERE user_id = ? AND course_id = ?',
      { replacements: [user_id, course_id] }
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'You are already enrolled in this course.' });
    }

    await db.query(
      'INSERT INTO Enrollments (user_id, course_id, progress) VALUES (?, ?, 0)',
      { replacements: [user_id, course_id] }
    );
    res.status(201).json({ message: 'Enrolled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Enrollment failed', error: err.message });
  }
};


// Get instructor's courses with stats
exports.getInstructorCourses = async (req, res) => {
  const { instructor_id } = req.query;
  try {
    const [courses] = await db.query(
      `SELECT 
         c.id, 
         c.title, 
         c.description,
         COUNT(e.user_id) AS total_students,
         COALESCE(ROUND(AVG(e.progress), 2), 0) AS avg_progress
       FROM Courses c
       LEFT JOIN Enrollments e ON c.id = e.course_id
       WHERE c.instructor_id = ?
       GROUP BY c.id`,
      { replacements: [instructor_id] }
    );
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch instructor courses', error: err.message });
  }
};
