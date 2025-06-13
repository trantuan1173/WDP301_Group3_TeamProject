const express = require("express");
const {
  getAttendances,
  getAttendancesByClass,
  getAttendancesByStudent,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  markBulkAttendance,
} = require("../controllers/attendanceController.js");
const { protect, authorize } = require("../middleware/authMiddleware.js");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Quản lý điểm danh
 */

/**
 * @swagger
 * /attendance:
 *   get:
 *     summary: Lấy danh sách điểm danh (chỉ admin, teacher)
 *     description: Lấy danh sách điểm danh (chỉ admin, teacher)
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách điểm danh
 */
router.get("/", protect, authorize("admin","teacher"), getAttendances)

/**
 * @swagger
 * /attendance:
 *   post:
 *     summary: Tạo điểm danh (chỉ admin, teacher)
 *     description: Tạo điểm danh (chỉ admin, teacher)
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               classId:
 *                 type: string
 *               studentId:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo điểm danh thành công
 */
router.post("/", protect, authorize("admin", "teacher"), createAttendance)

/**
 * @swagger
 * /attendance/bulk:
 *   post:
 *     summary: Tạo điểm danh (chỉ admin, teacher)
 *     description: Tạo điểm danh (chỉ admin, teacher)
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               classId:
 *                 type: string
 *               studentId:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo điểm danh thành công
 */
router.post("/bulk", protect, authorize("admin", "teacher"), markBulkAttendance)

/**
 * @swagger
 * /attendance/class/:classId:
 *   get:
 *     summary: Lấy danh sách điểm danh (chỉ admin, teacher)
 *     description: Lấy danh sách điểm danh (chỉ admin, teacher)
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách điểm danh
 */
router.get("/class/:classId", protect, getAttendancesByClass)

/**
 * @swagger
 * /attendance/student/:studentId:
 *   get:
 *     summary: Lấy danh sách điểm danh (chỉ khi login)
 *     description: Lấy danh sách điểm danh (chỉ khi login)
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách điểm danh
 */
router.get("/student/:studentId", protect, getAttendancesByStudent)

/**
 * @swagger
 * /attendance/:id:
 *   put:
 *     summary: Cập nhật điểm danh (chỉ admin, teacher)
 *     description: Cập nhật điểm danh (chỉ admin, teacher)
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               classId:
 *                 type: string
 *               studentId:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật điểm danh thành công
 */
router.put("/:id", protect, authorize("admin", "teacher"), updateAttendance)

/**
 * @swagger
 * /attendance/:id:
 *   delete:
 *     summary: Xóa điểm danh (chỉ admin, teacher)
 *     description: Xóa điểm danh (chỉ admin, teacher)
 *     tags: [Attendance]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Xóa điểm danh thành công
 */ 
router.delete("/:id", protect, authorize("admin", "teacher"), deleteAttendance)

module.exports = router;
