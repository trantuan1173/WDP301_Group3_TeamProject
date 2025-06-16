const express = require("express")
const { getTestSubmissions, getStudentSubmissions } = require("../controllers/testController.js")
const { protect, authorize } = require("../middleware/authMiddleware.js")

const router = express.Router()
/**
 * @swagger
 * tags:
 *   name: Test Submissions
 *   description: Quản lý bài kiểm tra đã submit
 */

/**
 * @swagger
 * /testSubmissions/{testId}:
 *   get:
 *     summary: Lấy danh sách bài kiểm tra đã submit (chỉ admin, teacher)
 *     description: Lấy danh sách bài kiểm tra đã submit (chỉ admin, teacher)
 *     tags: [Test Submissions]
 *     parameters:
 *       - in: path
 *         name: testId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách bài kiểm tra đã submit
 */
router.get("/:testId", protect, authorize("admin", "teacher"), getTestSubmissions)

/**
 * @swagger
 * /testSubmissions/student/{studentId}:
 *   get:
 *     summary: Lấy danh sách bài kiểm tra đã submit của sinh viên (chỉ admin, teacher)
 *     description: Lấy danh sách bài kiểm tra đã submit của sinh viên (chỉ admin, teacher)
 *     tags: [Test Submissions]
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
 *         description: Danh sách bài kiểm tra đã submit của sinh viên
 */
router.get("/student/:studentId", protect, getStudentSubmissions)

module.exports = router
