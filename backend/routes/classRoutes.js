const express = require("express");
const {
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
  addStudentToClass,
  removeStudentFromClass,
  getClassByStudentId,
  getClassByTeacherId,
} = require("../controllers/classController.js");
const { protect, authorize } = require("../middleware/authMiddleware.js");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Classes
 *   description: Quản lý lớp học
 */

/**
 * @swagger
 * /classes:
 *   get:
 *     summary: Lấy danh sách lớp học (chỉ admin, teacher)
 *     description: Lấy danh sách lớp học (chỉ admin, teacher)
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách lớp học
 */
router.get("/", protect, authorize("admin", "teacher"), getClasses)

/**
 * @swagger
 * /classes:
 *   post:
 *     summary: Tạo lớp học (chỉ admin)
 *     description: Tạo lớp học (chỉ admin)
 *     tags: [Classes]
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
 *         description: Tạo lớp học thành công
 */
router.post("/", protect, authorize("admin"), createClass)

/**
 * @swagger
 * /classes/{id}:
 *   get:
 *     summary: Lấy thông tin lớp học (chỉ admin, teacher)
 *     description: Lấy thông tin lớp học (chỉ admin, teacher)
 *     tags: [Classes]
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
 *         description: Thông tin lớp học
 */
router.get("/:id", protect, authorize("admin", "teacher"), getClass)

/**
 * @swagger
 * /classes/{id}:
 *   put:
 *     summary: Cập nhật thông tin lớp học (chỉ admin, teacher)
 *     description: Cập nhật thông tin lớp học (chỉ admin, teacher)
 *     tags: [Classes]
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
 *         description: Cập nhật thông tin lớp học thành công
 */
router.put("/:id", protect, authorize("admin", "teacher"), updateClass)

/**
 * @swagger
 * /classes/{id}:
 *   delete:
 *     summary: Xóa lớp học (chỉ admin)
 *     description: Xóa lớp học (chỉ admin)
 *     tags: [Classes]
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
 *         description: Xóa lớp học thành công
 */
router.delete("/:id", protect, authorize("admin"), deleteClass)

/**
 * @swagger
 * /classes/{id}/students:
 *   post:
 *     summary: Thêm sinh viên vào lớp (chỉ admin, teacher)
 *     description: Thêm sinh viên vào lớp (chỉ admin, teacher)
 *     tags: [Classes]
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
 *               studentId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Thêm sinh viên vào lớp thành công
 */
router.post("/:id/students", protect, authorize("admin", "teacher"), addStudentToClass)

/**
 * @swagger
 * /classes/{id}/students:
 *   delete:
 *     summary: Xóa sinh viên khỏi lớp (chỉ admin, teacher)
 *     description: Xóa sinh viên khỏi lớp (chỉ admin, teacher)
 *     tags: [Classes]
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
 *               studentId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Xóa sinh viên khỏi lớp thành công
 */
router.delete("/:id/students", protect, authorize("admin", "teacher"), removeStudentFromClass)

/**
 * @swagger
 * /classes/student/:studentId:
 *   get:
 *     summary: Lấy danh sách sinh viên trong lớp (chỉ admin, teacher)
 *     description: Lấy danh sách sinh viên trong lớp (chỉ admin, teacher)
 *     tags: [Classes]
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
 *         description: Danh sách sinh viên trong lớp
 */
router.get("/student/:studentId", protect, getClassByStudentId)  

/**
 * @swagger
 * /classes/teacher/:teacherId:
 *   get:
 *     summary: Lấy danh sách lớp học của giáo viên (chỉ admin, teacher)
 *     description: Lấy danh sách lớp học của giáo viên (chỉ admin, teacher)
 *     tags: [Classes]
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
 *         description: Danh sách lớp học của giáo viên
 */
router.get("/teacher/:teacherId", protect, authorize("admin", "teacher"), getClassByTeacherId)

module.exports = router;
