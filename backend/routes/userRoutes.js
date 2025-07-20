const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/dashboard/:id', userController.getStudentDashboard);

module.exports = router;
