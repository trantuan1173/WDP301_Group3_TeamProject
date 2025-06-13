const express = require("express")
const {
  getSchedules,
  getSchedulesByClass,
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getSchedulesByStudent,
  getSchedulesByTeacher
} = require("../controllers/scheduleController.js")
const { protect, authorize } = require("../middleware/authMiddleware.js")

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Schedules
 *   description: Quản lý lịch học
 */

/**
 * @swagger
 * /schedule:
 *   get:
 *     summary: Lấy danh sách lịch học (chỉ admin)
 *     description: Lấy danh sách lịch học (chỉ admin)
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách lịch học
 */
router.get("/", protect, getSchedules)

/**
 * @swagger
 * /schedule:
 *   post:
 *     summary: Tạo lịch học (chỉ admin, teacher)
 *     description: Tạo lịch học (chỉ admin, teacher)
 *     tags: [Schedules]
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
 *               courseId:
 *                 type: string
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo lịch học thành công
 */
router.post("/", protect, authorize("admin", "teacher"), createSchedule)

/**
 * @swagger
 * /schedule/class/:classId:
 *   get:
 *     summary: Lấy danh sách lịch học theo lớp (chỉ admin)
 *     description: Lấy danh sách lịch học theo lớp (chỉ admin)
 *     tags: [Schedules]
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
 *         description: Danh sách lịch học
 */
router.get("/class/:classId", protect, getSchedulesByClass)

/**
 * @swagger
 * /schedule/{id}:
 *   get:
 *     summary: Lấy thông tin lịch học (chỉ admin)
 *     description: Lấy thông tin lịch học (chỉ admin)
 *     tags: [Schedules]
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
 *         description: Thông tin lịch học
 */
router.get("/:id", protect, getSchedule)

/**
 * @swagger
 * /schedule/{id}:
 *   put:
 *     summary: Cập nhật lịch học (chỉ admin, teacher)
 *     description: Cập nhật lịch học (chỉ admin, teacher)
 *     tags: [Schedules]
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
 *               courseId:
 *                 type: string
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật lịch học thành công
 */
router.put("/:id", protect, authorize("admin", "teacher"), updateSchedule)

/**
 * @swagger
 * /schedule/{id}:
 *   delete:
 *     summary: Xóa lịch học (chỉ admin, teacher)
 *     description: Xóa lịch học (chỉ admin, teacher)
 *     tags: [Schedules]
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
 *         description: Xóa lịch học thành công
 */
router.delete("/:id", protect, authorize("admin", "teacher"), deleteSchedule)

/**
 * @swagger
 * /schedule/student/:studentId:
 *   get:
 *     summary: Lấy danh sách lịch học theo học sinh (chỉ admin)
 *     description: Lấy danh sách lịch học theo học sinh (chỉ admin)
 *     tags: [Schedules]
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
 *         description: Danh sách lịch học
 */
router.get("/student/:studentId", protect, getSchedulesByStudent) 

/**
 * @swagger
 * /schedule/teacher/:teacherId:
 *   get:
 *     summary: Lấy danh sách lịch học theo giáo viên (chỉ admin)
 *     description: Lấy danh sách lịch học theo giáo viên (chỉ admin)
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách lịch học
 */
router.get("/teacher/:teacherId", protect, authorize("admin", "teacher"), getSchedulesByTeacher)

module.exports = router
