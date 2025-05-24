const express = require('express');
const attendanceRoutes = require('./attendanceRoutes.js');
const classRoutes = require('./classRoutes.js');
const courseDetailRoutes = require('./courseDetailRoutes.js');
const courseRoutes = require('./courseRoutes.js');
const feedbackRoutes = require('./feedbackRoutes.js');
const profileRoutes = require('./profileRoutes.js');
const roleRoutes = require('./roleRoutes.js');
const scheduleRoutes = require('./scheduleRoutes.js');
const testRoutes = require('./testRoutes.js');
const testSubmissionRoutes = require('./testSubmissionRoutes.js');
const userRoutes = require('./userRoutes.js');

const router = express.Router();

router.use('/attendance', attendanceRoutes);
router.use('/class', classRoutes);
router.use('/courseDetail', courseDetailRoutes);
router.use('/courses', courseRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/profiles', profileRoutes);
router.use('/role', roleRoutes);
router.use('/schedule', scheduleRoutes);
router.use('/test', testRoutes);
router.use('/testSubmission', testSubmissionRoutes);
router.use('/users', userRoutes);

module.exports=router;