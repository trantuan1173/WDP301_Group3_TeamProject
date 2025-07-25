const express = require("express");
const router = express.Router();
const { createCustomerConsulting, getAllCustomerConsulting, updateCustomerConsulting, deleteCustomerConsulting } = require("../controllers/customerConsultingController");
const { protect, authorize } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: CustomerConsultings
 *   description: Khách hàng tham gia tư vấn
 */

/**
 * @swagger
 * /customerConsultings:
 *   post:
 *     summary: Tạo tư vấn (chỉ admin)
 *     description: Tạo tư vấn (chỉ admin)
 *     tags: [CustomerConsultings]
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
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo tư vấn thành công
 */
router.post("/", createCustomerConsulting);

/**
 * @swagger
 * /customerConsultings:
 *   get:
 *     summary: Lấy danh sách tư vấn (chỉ admin)
 *     description: Lấy danh sách tư vấn (chỉ admin)
 *     tags: [CustomerConsultings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách tư vấn
 */
router.get("/", protect, authorize("admin"), getAllCustomerConsulting);

/**
 * @swagger
 * /customerConsultings/{id}:
 *   put:
 *     summary: Cập nhật tư vấn (chỉ admin)
 *     description: Cập nhật tư vấn (chỉ admin)
 *     tags: [CustomerConsultings]
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
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               content:
 *                 type: string
 *               note:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: ["pending", "completed", "rejected"]
 *     responses:
 *       200:
 *         description: Cập nhật tư vấn thành công
 */
router.put("/:id", protect, authorize("admin"), updateCustomerConsulting);

/**
 * @swagger
 * /customerConsultings/{id}:
 *   delete:
 *     summary: Xóa tư vấn (chỉ admin)
 *     description: Xóa tư vấn (chỉ admin)
 *     tags: [CustomerConsultings]
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
 *         description: Xóa tư vấn thành công
 */
router.delete("/:id", protect, authorize("admin"), deleteCustomerConsulting);

module.exports = router;
