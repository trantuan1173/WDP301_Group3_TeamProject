const express = require("express")
const {
  getAllFeedbacksAllCourse,
  getAllFeedbacksACourse,
  getAllFeedbacksCourseByUser,
  getFeedbackCourseHighlight,
  createFeedbackCourse,
  updateFeedbackCourse,
  deleteFeedbackCourse,
  highlightFeedbackCourse
} = require("../controllers/feedbackCourseController.js")
const { protect, authorize } = require("../middleware/authMiddleware.js")

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Feedbacks Course
 *   description: Phản hồi
 */

/**
 * @swagger
 * /feedbacksCourse:
 *   get:
 *     summary: Lấy danh sách phản hồi (chỉ admin)
 *     description: Lấy danh sách phản hồi (chỉ admin)
 *     tags: [Feedbacks Course]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách phản hồi
 */
router.get("/", protect, authorize("admin"), getAllFeedbacksAllCourse)

/**
 * @swagger
 * /feedbacksCourse:
 *   post:
 *     summary: Tạo phản hồi
 *     description: Tạo phản hồi
 *     tags: [Feedbacks Course]
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
 *         description: Tạo phản hồi thành công
 */
router.post("/", protect, createFeedbackCourse)

/**
 * @swagger
 * /feedbacksCourse/highlight/:courseId:
 *   get:
 *     summary: Lấy thông tin phản hồi highlight
 *     description: Lấy thông tin phản hồi highlight
 *     tags: [Feedbacks Course]
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
 *         description: Thông tin phản hồi
 */
router.get("/highlight/:courseId", getFeedbackCourseHighlight)

/**
 * @swagger
 * /feedbacksCourse/user/:userId:
 *   get:
 *     summary: Lấy danh sách phản hồi của người dùng (chỉ admin)
 *     description: Lấy danh sách phản hồi của người dùng (chỉ admin)
 *     tags: [Feedbacks Course]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách phản hồi
 */
router.get("/user/:userId", protect, authorize("admin"), getAllFeedbacksCourseByUser)

/**
 * @swagger
 * /feedbacksCourse/:id:
 *   put:
 *     summary: Cập nhật thông tin phản hồi
 *     description: Cập nhật thông tin phản hồi
 *     tags: [Feedbacks Course]
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
 *               studentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thông tin phản hồi thành công
 */
router.put("/:id", protect, updateFeedbackCourse)

/**
 * @swagger
 * /feedbacksCourse/:id:
 *   delete:
 *     summary: Xóa phản hồi (chỉ admin)
 *     description: Xóa phản hồi (chỉ admin)
 *     tags: [Feedbacks Course]
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
 *         description: Xóa phản hồi thành công
 */
router.delete("/:id", protect, authorize("admin"), deleteFeedbackCourse)

/**
 * @swagger
 * /feedbacksCourse/highlight/:id:
 *   put:
 *     summary: Cập nhật thông tin phản hồi (chỉ admin)
 *     description: Cập nhật thông tin phản hồi (chỉ admin)
 *     tags: [Feedbacks Course]
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
 *               highlight:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cập nhật thông tin phản hồi thành công
 */
router.put("/highlight/:id", protect, authorize("admin"), highlightFeedbackCourse)

/**
 * @swagger
 * /feedbacksCourse/:courseId:
 *   get:
 *     summary: Lấy danh sách phản hồi theo khóa học
 *     description: Lấy danh sách phản hồi theo khóa học
 *     tags: [Feedbacks Course]
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
 *         description: Danh sách phản hồi
 */
router.get("/:courseId", protect, getAllFeedbacksACourse)

module.exports = router
