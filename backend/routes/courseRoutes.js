const express = require('express');
const router = express.Router();
const {
  getStudentCourses,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');

router.get('/student/:id', getStudentCourses);              // GET enrolled courses for student
router.post('/create', createCourse);                       // POST create new course
router.put('/update/:courseId', updateCourse);              // PUT update course
router.delete('/delete/:courseId', deleteCourse);           // DELETE course

module.exports = router;
