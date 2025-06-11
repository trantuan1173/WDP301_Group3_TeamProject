const express = require("express")
const {
  getProfiles,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/profileController.js")
const { protect, authorize } = require("../middleware/authMiddleware.js")

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Profiles
 *   description: Hồ sơ
 */

/**
 * @swagger
 * /profiles:
 *   get:
 *     summary: Lấy danh sách hồ sơ (chỉ admin)
 *     description: Lấy danh sách hồ sơ (chỉ admin)
 *     tags: [Profiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách hồ sơ
 */
router.get("/", protect, getProfiles)

/**
 * @swagger
 * /profiles:
 *   post:
 *     summary: Tạo hồ sơ (chỉ admin)
 *     description: Tạo hồ sơ (chỉ admin)
 *     tags: [Profiles]
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
 *         description: Tạo hồ sơ thành công
 */
router.post("/", protect, createProfile)

/**
 * @swagger
 * /profiles/:id:
 *   get:
 *     summary: Lấy thông tin hồ sơ (chỉ admin)
 *     description: Lấy thông tin hồ sơ (chỉ admin)
 *     tags: [Profiles]
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
 *         description: Thông tin hồ sơ
 */
router.get("/:id", protect, getProfile)

/**
 * @swagger
 * /profiles/:id:
 *   put:
 *     summary: Cập nhật thông tin hồ sơ (chỉ admin)
 *     description: Cập nhật thông tin hồ sơ (chỉ admin)
 *     tags: [Profiles]
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
 *         description: Cập nhật thông tin hồ sơ thành công
 */
router.put("/:id", protect, updateProfile)

/**
 * @swagger
 * /profiles/:id:
 *   delete:
 *     summary: Xóa hồ sơ (chỉ admin)
 *     description: Xóa hồ sơ (chỉ admin)
 *     tags: [Profiles]
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
 *         description: Xóa hồ sơ thành công
 */
router.delete("/:id", protect, authorize("admin"), deleteProfile)

module.exports = router
