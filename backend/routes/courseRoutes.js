const express = require("express")
const { getCourses, getCourse, createCourse, updateCourse, deleteCourse } = require("../controllers/courseController.js")
const { protect, authorize } = require("../middleware/authMiddleware.js")

const router = express.Router()
/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Khóa học
 */

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Lấy danh sách khóa học (chỉ admin)
 *     description: Lấy danh sách khóa học (chỉ admin)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách khóa học
 */
router.get("/", getCourses)

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Tạo khóa học (chỉ admin)
 *     description: Tạo khóa học (chỉ admin)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo khóa học thành công
 */
router.post("/", protect, authorize("admin"), createCourse)

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Lấy thông tin khóa học (chỉ admin)
 *     description: Lấy thông tin khóa học (chỉ admin)
 *     tags: [Courses]
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
 *         description: Thông tin khóa học
 */
router.get("/:id", getCourse)

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Cập nhật thông tin khóa học (chỉ admin)
 *     description: Cập nhật thông tin khóa học (chỉ admin)
 *     tags: [Courses]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thông tin khóa học thành công
 */
router.put("/:id", protect, authorize("admin"), updateCourse)

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Xóa khóa học (chỉ admin)
 *     description: Xóa khóa học (chỉ admin)
 *     tags: [Courses]
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
 *         description: Xóa khóa học thành công
 */
router.delete("/:id", protect, authorize("admin"), deleteCourse)

module.exports = router
