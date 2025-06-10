const express = require("express")
const { getRoles, getRole, createRole, updateRole, deleteRole } = require("../controllers/roleController.js")
const { protect, authorize } = require("../middleware/authMiddleware.js")

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Quản lý vai trò
 */

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Lấy danh sách vai trò (chỉ admin)
 *     description: Lấy danh sách vai trò (chỉ admin)
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách vai trò
 */
router.get("/", protect, authorize("admin"), getRoles)

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Tạo vai trò (chỉ admin)
 *     description: Tạo vai trò (chỉ admin)
 *     tags: [Roles]
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
 *     responses:
 *       201:
 *         description: Tạo vai trò thành công
 */
router.post("/", protect, authorize("admin"), createRole)

/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     summary: Lấy thông tin vai trò (chỉ admin)
 *     description: Lấy thông tin vai trò (chỉ admin)
 *     tags: [Roles]
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
 *         description: Thông tin vai trò
 */
router.get("/:id", protect, getRole)

/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     summary: Cập nhật vai trò (chỉ admin)
 *     description: Cập nhật vai trò (chỉ admin)
 *     tags: [Roles]
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
 *     responses:
 *       200:
 *         description: Cập nhật vai trò thành công
 */
router.put("/:id", protect, authorize("admin"), updateRole)

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Xóa vai trò (chỉ admin)
 *     description: Xóa vai trò (chỉ admin)
 *     tags: [Roles]
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
 *         description: Xóa vai trò thành công
 */
router.delete("/:id", protect, authorize("admin"), deleteRole)

module.exports = router
