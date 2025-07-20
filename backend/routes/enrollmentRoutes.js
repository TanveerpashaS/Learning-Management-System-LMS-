// backend/routes/enrollmentRoutes.js
const express = require('express');
const router  = express.Router();
const {
  getStudentEnrollmentIds,
  getAvailableCourses,
  enrollInCourse
} = require('../controllers/enrollmentController');

// Get course IDs the student is enrolled in
// GET /api/enrollment/student/:id
router.get('/student/:id', getStudentEnrollmentIds);

// Get courses NOT yet enrolled by the student
// GET /api/enrollment/available/:id
router.get('/available/:id', getAvailableCourses);

// Enroll a student in a course
// POST /api/enrollment/enroll
// body: { user_id, course_id }
router.post('/enroll', enrollInCourse);

module.exports = router;
