const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// ✅ Fix: Just use /:studentId instead of /courses/:studentId
router.get('/:studentId', studentController.getStudentCourses);

// ✅ Available courses (already fine)
router.get('/available/:studentId', studentController.getAvailableCourses);

// ✅ Update progress
router.post('/update-progress', studentController.updateProgress);

module.exports = router;
