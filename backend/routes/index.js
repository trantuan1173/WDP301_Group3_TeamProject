const express = require('express');
const attendanceRoutes = require('./attendanceRoutes.js');
const userRoutes = require('./userRoutes.js');
const testRoutes = require('./testRoutes.js');
const classRoutes = require('./classRoutes.js');
const router = express.Router();

router.use('/attendance', attendanceRoutes);
router.use('/users', userRoutes);
router.use('/test', testRoutes);
router.use('/class', classRoutes);

module.exports=router;