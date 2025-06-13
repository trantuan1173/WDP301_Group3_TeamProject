const express = require("express");
const { getUsers, getUser, createUser, updateUser, deleteUser, loginUser, adminCreateTeacher, getAllTeacher, verifyUser, forgotPassword, resetPassword, authProfile, updateUserByAdmin, resendVerifyEmail } = require("../controllers/userController.js");
const { protect, authorize } = require("../middleware/authMiddleware.js");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Quản lý người dùng
 */

/**
 * @swagger
 * /users/allTeacher:
 *   get:
 *     summary: Lấy danh sách giáo viên (chỉ admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách giáo viên
 */
router.get("/allTeacher", protect, authorize("admin"), getAllTeacher)


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lấy danh sách người dùng (chỉ admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 */
router.get("/", protect, authorize("admin"), getUsers)


/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Users]
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
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 */
router.post("/register", createUser)

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 */
router.post("/login", loginUser)

/**
 * @swagger
 * /users/authProfile:
 *   get:
 *     summary: Lấy thông tin người dùng đã đăng nhập
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin người dùng
 */
router.get("/authProfile", protect, authProfile)

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Lấy thông tin người dùng theo ID
 *     tags: [Users]
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
 *         description: Thông tin người dùng
 */
router.get("/:id", protect, getUser)

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     tags: [Users]
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thông tin người dùng thành công
 */
router.put("/:id", protect, updateUser)

/**
 * @swagger
 * /users/{id}/updateByAdmin:
 *   put:
 *     summary: Cập nhật thông tin người dùng (chỉ admin)
 *     tags: [Users]
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thông tin người dùng thành công
 */
router.put("/updateByAdmin/:id", protect, authorize("admin"), updateUserByAdmin)

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Xóa người dùng (chỉ admin)
 *     tags: [Users]
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
 *         description: Xóa người dùng thành công
 */
router.delete("/:id", protect, authorize("admin"), deleteUser)

/**
 * @swagger
 * /users/createTeacher:
 *   post:
 *     summary: Tạo tài khoản giáo viên (chỉ admin)
 *     tags: [Users]
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
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo tài khoản giáo viên thành công
 */
router.post("/createTeacher", protect, authorize("admin"), adminCreateTeacher)

/**
 * @swagger
 * /users/verify/{token}:
 *   get:
 *     summary: Xác minh tài khoản
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xác minh tài khoản thành công
 */
router.get("/verify/:token", verifyUser)

/**
 * @swagger
 * /users/resend-verify-email:
 *   post:
 *     summary: Gửi lại email xác minh
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Gửi lại email xác minh thành công
 */
router.post("/resend-verify-email", resendVerifyEmail)

/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     summary: Quên mật khẩu
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Quên mật khẩu thành công
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /users/reset-password/{token}:
 *   post:
 *     summary: Reset mật khẩu
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset mật khẩu thành công
 */
router.post("/reset-password/:token", resetPassword);



module.exports = router;

