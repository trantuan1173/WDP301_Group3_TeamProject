const express = require("express");
const {
  getTests,
  getTestsByClass,
  getTest,
  createTest,
  updateTest,
  deleteTest,
  submitTest,
  getTestSubmissions,
  getStudentSubmissions,
} = require("../controllers/testController.js");
const { protect, authorize } = require("../middleware/authMiddleware.js");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tests
 *   description: Quản lý bài kiểm tra
 */

/**
 * @swagger
 * /tests:
 *   get:
 *     summary: Lấy danh sách bài kiểm tra (chỉ admin)
 *     description: Lấy danh sách bài kiểm tra (chỉ admin)
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách bài kiểm tra
 */ 
router.get("/", protect, getTests)

/**
 * @swagger
 * /tests:
 *   post:
 *     summary: Tạo bài kiểm tra (chỉ admin, teacher)
 *     description: Tạo bài kiểm tra (chỉ admin, teacher)
 *     tags: [Tests]
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
 *               courseId:
 *                 type: string
 *               classId:
 *                 type: string
 *               time:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo bài kiểm tra thành công
 */
router.post("/", protect, authorize("admin", "teacher"), createTest)

/**
 * @swagger
 * /tests/class/{classId}:
 *   get:
 *     summary: Lấy danh sách bài kiểm tra theo lớp (chỉ admin)
 *     description: Lấy danh sách bài kiểm tra theo lớp (chỉ admin)
 *     tags: [Tests]
 *     parameters:
 *       - in: path
 *         name: classId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách bài kiểm tra
 */
router.get("/class/:classId", protect, getTestsByClass)

/**
 * @swagger
 * /tests/{id}:
 *   get:
 *     summary: Lấy thông tin bài kiểm tra (chỉ admin)
 *     description: Lấy thông tin bài kiểm tra (chỉ admin)
 *     tags: [Tests]
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
 *         description: Thông tin bài kiểm tra
 */
router.get("/:id", protect, getTest)

/**
 * @swagger
 * /tests/{id}:
 *   put:
 *     summary: Cập nhật thông tin bài kiểm tra (chỉ admin, teacher)
 *     description: Cập nhật thông tin bài kiểm tra (chỉ admin, teacher)
 *     tags: [Tests]
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
 *               courseId:
 *                 type: string
 *               classId:
 *                 type: string
 *               time:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thông tin bài kiểm tra thành công
 */
router.put("/:id", protect, authorize("admin", "teacher"), updateTest)

/**
 * @swagger
 * /tests/{id}:
 *   delete:
 *     summary: Xóa bài kiểm tra (chỉ admin, teacher)
 *     description: Xóa bài kiểm tra (chỉ admin, teacher)
 *     tags: [Tests]
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
 *         description: Xóa bài kiểm tra thành công
 */
router.delete("/:id", protect, authorize("admin", "teacher"), deleteTest)

/**
 * @swagger
 * /tests/submit:
 *   post:
 *     summary: Submit bài kiểm tra (chỉ student)
 *     description: Submit bài kiểm tra (chỉ student)
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               testId:
 *                 type: string
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionId:
 *                       type: string
 *                     answer:
 *                       type: string
 *     responses:
 *       200:
 *         description: Submit bài kiểm tra thành công
 */
router.post("/submit", protect, submitTest)

/**
 * @swagger
 * /tests/{testId}/submissions:
 *   get:
 *     summary: Lấy danh sách bài kiểm tra đã submit (chỉ admin, teacher)
 *     description: Lấy danh sách bài kiểm tra đã submit (chỉ admin, teacher)
 *     tags: [Tests]
 *     parameters:
 *       - in: path
 *         name: testId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách bài kiểm tra đã submit
 */
router.get("/:testId/submissions", protect, authorize("admin", "teacher"), getTestSubmissions)

/**
 * @swagger
 * /tests/submissions/student/{studentId}:
 *   get:
 *     summary: Lấy danh sách bài kiểm tra đã submit của sinh viên (chỉ admin, teacher)
 *     description: Lấy danh sách bài kiểm tra đã submit của sinh viên (chỉ admin, teacher)
 *     tags: [Tests]
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
 *         description: Danh sách bài kiểm tra đã submit của sinh viên
 */
router.get("/submissions/student/:studentId", protect, getStudentSubmissions)

module.exports = router;
