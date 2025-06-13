const express = require("express")
const {
  getFeedbacks,
  getFeedbacksByUser,
  getFeedback,
  createFeedback,
  updateFeedback,
  deleteFeedback,
} = require("../controllers/feedbackController.js")
const { protect, authorize } = require("../middleware/authMiddleware.js")

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Feedbacks
 *   description: Phản hồi
 */

/**
 * @swagger
 * /feedbacks:
 *   get:
 *     summary: Lấy danh sách phản hồi (chỉ admin)
 *     description: Lấy danh sách phản hồi (chỉ admin)
 *     tags: [Feedbacks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách phản hồi
 */
router.get("/", protect, getFeedbacks)

/**
 * @swagger
 * /feedbacks:
 *   post:
 *     summary: Tạo phản hồi (chỉ admin)
 *     description: Tạo phản hồi (chỉ admin)
 *     tags: [Feedbacks]
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
router.post("/", protect, createFeedback)

/**
 * @swagger
 * /feedbacks/user/:userId:
 *   get:
 *     summary: Lấy danh sách phản hồi theo sinh viên (chỉ admin)
 *     description: Lấy danh sách phản hồi theo sinh viên (chỉ admin)
 *     tags: [Feedbacks]
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
router.get("/user/:userId", protect, getFeedbacksByUser)

/**
 * @swagger
 * /feedbacks/:id:
 *   get:
 *     summary: Lấy thông tin phản hồi (chỉ admin)
 *     description: Lấy thông tin phản hồi (chỉ admin)
 *     tags: [Feedbacks]
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
router.get("/:id", protect, getFeedback)

/**
 * @swagger
 * /feedbacks/:id:
 *   put:
 *     summary: Cập nhật thông tin phản hồi (chỉ admin)
 *     description: Cập nhật thông tin phản hồi (chỉ admin)
 *     tags: [Feedbacks]
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
router.put("/:id", protect, updateFeedback)

/**
 * @swagger
 * /feedbacks/:id:
 *   delete:
 *     summary: Xóa phản hồi (chỉ admin)
 *     description: Xóa phản hồi (chỉ admin)
 *     tags: [Feedbacks]
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
router.delete("/:id", protect, authorize("admin"), deleteFeedback)

module.exports = router
