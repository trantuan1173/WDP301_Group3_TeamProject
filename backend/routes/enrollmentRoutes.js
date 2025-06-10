const express = require("express")
const {
  getEnrollments,
  getEnrollmentsByCourse,
  getEnrollmentsByStudent,
  getEnrollment,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
  updateEnrollmentStatus,
} = require("../controllers/enrollmentController.js")
const { protect, authorize } = require("../middleware/authMiddleware.js")

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Đăng ký khóa học
 */

/**
 * @swagger
 * /enrollments:
 *   get:
 *     summary: Lấy danh sách đăng ký khóa học (chỉ admin)
 *     description: Lấy danh sách đăng ký khóa học (chỉ admin)
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách đăng ký khóa học
 */
router.get("/", protect, getEnrollments)

/**
 * @swagger
 * /enrollments:
 *   post:
 *     summary: Tạo đăng ký khóa học (chỉ admin)
 *     description: Tạo đăng ký khóa học (chỉ admin)
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *               studentId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo đăng ký khóa học thành công
 */
router.post("/", protect, createEnrollment)

/**
 * @swagger
 * /enrollments/course/:courseId:
 *   get:
 *     summary: Lấy danh sách đăng ký khóa học theo khóa học (chỉ admin)
 *     description: Lấy danh sách đăng ký khóa học theo khóa học (chỉ admin)
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách đăng ký khóa học
 */
router.get("/course/:courseId", protect, getEnrollmentsByCourse)

/**
 * @swagger
 * /enrollments/student/:studentId:
 *   get:
 *     summary: Lấy danh sách đăng ký khóa học theo sinh viên (chỉ admin)
 *     description: Lấy danh sách đăng ký khóa học theo sinh viên (chỉ admin)
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách đăng ký khóa học
 */
router.get("/student/:studentId", protect, getEnrollmentsByStudent)

/**
 * @swagger
 * /enrollments/:id:
 *   get:
 *     summary: Lấy thông tin đăng ký khóa học (chỉ admin)
 *     description: Lấy thông tin đăng ký khóa học (chỉ admin)
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin đăng ký khóa học
 */
router.get("/:id", protect, getEnrollment)

/**
 * @swagger
 * /enrollments/:id:
 *   put:
 *     summary: Cập nhật thông tin đăng ký khóa học (chỉ admin)
 *     description: Cập nhật thông tin đăng ký khóa học (chỉ admin)
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *               studentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thông tin đăng ký khóa học thành công
 */
router.put("/:id", protect, authorize("admin", "teacher"), updateEnrollment)

/**
 * @swagger
 * /enrollments/:id:
 *   delete:
 *     summary: Xóa đăng ký khóa học (chỉ admin)
 *     description: Xóa đăng ký khóa học (chỉ admin)
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Xóa đăng ký khóa học thành công
 */
router.delete("/:id", protect, authorize("admin"), deleteEnrollment)

/**
 * @swagger
 * /enrollments/:id/status:
 *   put:
 *     summary: Cập nhật trạng thái đăng ký khóa học (chỉ admin)
 *     description: Cập nhật trạng thái đăng ký khóa học (chỉ admin)
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái đăng ký khóa học thành công
 */
router.put("/:id/status", protect, authorize("admin", "teacher"), updateEnrollmentStatus)

module.exports = router

