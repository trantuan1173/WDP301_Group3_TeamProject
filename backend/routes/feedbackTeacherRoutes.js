const express = require("express")
const {
  getAllFeedbacksAllTeacher,
  getAllFeedbacksATeacher,
  getFeedbacksTeacherByUser,
  getFeedbacksTeacherHighlight,
  getFeedbacksTeacherHighlightForHome,
  createFeedbackTeacher,
  updateFeedbackTeacher,
  deleteFeedbackTeacher,
  highlightFeedbackTeacher
} = require("../controllers/feedbackTeacherController.js")
const { protect, authorize } = require("../middleware/authMiddleware.js")

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Feedbacks Teacher
 *   description: Phản hồi
 */

/**
 * @swagger
 * /feedbacksTeacher:
 *   get:
 *     summary: Lấy danh sách phản hồi (chỉ admin)
 *     description: Lấy danh sách phản hồi (chỉ admin)
 *     tags: [Feedbacks Teacher]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách phản hồi
 */
router.get("/", protect, authorize("admin"), getAllFeedbacksAllTeacher)

/**
 * @swagger
 * /feedbacksTeacher/highlight:
 *   get:
 *     summary: Lấy danh sách phản hồi highlight trong trang chủ
 *     description: Lấy danh sách phản hồi highlight trong trang chủ
 *     tags: [Feedbacks Teacher]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách phản hồi highlight
 */
router.get("/highlight", getFeedbacksTeacherHighlightForHome)

/**
 * @swagger
 * /feedbacksTeacher:
 *   post:
 *     summary: Tạo phản hồi
 *     description: Tạo phản hồi
 *     tags: [Feedbacks Teacher]
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
router.post("/", protect, createFeedbackTeacher)

/**
 * @swagger
 * /feedbacksTeacher/highlight/:id:
 *   get:
 *     summary: Lấy thông tin phản hồi highlight
 *     description: Lấy thông tin phản hồi highlight
 *     tags: [Feedbacks Teacher]
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
 *         description: Thông tin phản hồi
 */
router.get("/highlight/:teacherId", getFeedbacksTeacherHighlight)

/**
 * @swagger
 * /feedbacksTeacher/user/:studentId:
 *   get:
 *     summary: Lấy danh sách phản hồi của người dùng (chỉ admin)
 *     description: Lấy danh sách phản hồi của người dùng (chỉ admin)
 *     tags: [Feedbacks Teacher]
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
 *         description: Danh sách phản hồi
 */
router.get("/user/:studentId", protect, authorize("admin"), getFeedbacksTeacherByUser)

/**
 * @swagger
 * /feedbacksTeacher/:id:
 *   put:
 *     summary: Cập nhật thông tin phản hồi
 *     description: Cập nhật thông tin phản hồi
 *     tags: [Feedbacks Teacher]
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
router.put("/:id", protect, updateFeedbackTeacher)

/**
 * @swagger
 * /feedbacksTeacher/:id:
 *   delete:
 *     summary: Xóa phản hồi (chỉ admin)
 *     description: Xóa phản hồi (chỉ admin)
 *     tags: [Feedbacks Teacher]
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
router.delete("/:id", protect, authorize("admin"), deleteFeedbackTeacher)

/**
 * @swagger
 * /feedbacksTeacher/highlight/:id:
 *   put:
 *     summary: Cập nhật thông tin phản hồi (chỉ admin)
 *     description: Cập nhật thông tin phản hồi (chỉ admin)
 *     tags: [Feedbacks Teacher]
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
router.put("/highlight/:id", protect, authorize("admin"), highlightFeedbackTeacher)

/**
 * @swagger
 * /feedbacksTeacher/:teacherId:
 *   get:
 *     summary: Lấy danh sách phản hồi theo giáo viên
 *     description: Lấy danh sách phản hồi theo giáo viên
 *     tags: [Feedbacks Teacher]
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
 *         description: Danh sách phản hồi
 */
router.get("/:teacherId", protect, getAllFeedbacksATeacher)

module.exports = router
