// backend/routes/instructorRoutes.js
const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/courseController');

// Instructor CRUD
router.post('/course',      ctrl.createCourse);
router.get('/courses',      ctrl.getInstructorCourses);  // GET /api/instructor/courses?instructor_id=#
router.put('/course/:id',   ctrl.updateCourse);
router.delete('/course/:id',ctrl.deleteCourse);

// Student enroll endpoint
router.post('/enroll',      ctrl.enrollInCourse);

module.exports = router;
