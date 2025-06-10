const express = require("express")
const {
  getCourseDetails,
  getCourseDetailsByCourse,
  getCourseDetail,
  createCourseDetail,
  updateCourseDetail,
  deleteCourseDetail,
  getCourseDetailsForGuest,
} = require("../controllers/courseDetailController.js")
const { protect, authorize } = require("../middleware/authMiddleware.js")

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Course Details
 *   description: Quản lý chi tiết khóa học
 */

/**
 * @swagger
 * /courseDetails:
 *   get:
 *     summary: Lấy danh sách chi tiết khóa học
 *     description: Lấy danh sách chi tiết khóa học
 *     tags: [Course Details]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách chi tiết khóa học
 */
router.get("/", getCourseDetails)

/**
 * @swagger
 * /courseDetails/forguest:
 *   get:
 *     summary: Lấy danh sách chi tiết khóa học (không cần đăng nhập)
 *     description: Lấy danh sách chi tiết khóa học (không cần đăng nhập)
 *     tags: [Course Details]
 *     responses:
 *       200:
 *         description: Danh sách chi tiết khóa học
 */
router.get("/forguest", getCourseDetailsForGuest)

/**
 * @swagger
 * /courseDetails:
 *   post:
 *     summary: Tạo chi tiết khóa học (chỉ admin)
 *     description: Tạo chi tiết khóa học (chỉ admin)
 *     tags: [Course Details]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo chi tiết khóa học thành công
 */
router.post("/", protect, authorize("admin"), createCourseDetail)

/**
 * @swagger
 * /courseDetails/course/:courseId:
 *   get:
 *     summary: Lấy danh sách chi tiết khóa học theo khóa học
 *     description: Lấy danh sách chi tiết khóa học theo khóa học
 *     tags: [Course Details]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách chi tiết khóa học
 */
router.get("/course/:courseId", getCourseDetailsByCourse)

/**
 * @swagger
 * /courseDetails/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết khóa học (chỉ admin)
 *     description: Lấy thông tin chi tiết khóa học (chỉ admin)
 *     tags: [Course Details]
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
 *         description: Thông tin chi tiết khóa học
 */
router.get("/:id", protect, getCourseDetail)

/**
 * @swagger
 * /courseDetails/{id}:
 *   put:
 *     summary: Cập nhật thông tin chi tiết khóa học (chỉ admin)
 *     description: Cập nhật thông tin chi tiết khóa học (chỉ admin)
 *     tags: [Course Details]
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
 *               courseId:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thông tin chi tiết khóa học thành công
 */
router.put("/:id", protect, authorize("admin"), updateCourseDetail)

/**
 * @swagger
 * /courseDetails/{id}:
 *   delete:
 *     summary: Xóa chi tiết khóa học (chỉ admin)
 *     description: Xóa chi tiết khóa học (chỉ admin)
 *     tags: [Course Details]
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
 *         description: Xóa chi tiết khóa học thành công
 */
router.delete("/:id", protect, authorize("admin"), deleteCourseDetail)



module.exports = router
