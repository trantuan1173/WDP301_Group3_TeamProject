const express = require("express")
const {
  getTestAssigns,
  getTestAssignsByClass,
  getTestAssignsByCourse,
  getTestAssign,
  createTestAssign,
  updateTestAssign,
  deleteTestAssign,
  getTestAssignsByStudent,
  getTestAssignsForStudent,
} = require("../controllers/testAssignController.js")
const { protect, authorize } = require("../middleware/authMiddleware.js")

const router = express.Router()
/**
 * @swagger
 * tags:
 *   name: Test Assigns
 *   description: Quản lý phân công bài kiểm tra
 */

/**
 * @swagger
 * /test-assigns:
 *   get:
 *     summary: Lấy danh sách phân công bài kiểm tra (chỉ admin)
 *     description: Lấy danh sách phân công bài kiểm tra (chỉ admin)
 *     tags: [Test Assigns]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách phân công bài kiểm tra
 */
router.get("/", protect, getTestAssigns)



/**
 * @swagger
 * /test-assigns:
 *   post:
 *     summary: Tạo phân công bài kiểm tra (chỉ admin, teacher)
 *     description: Tạo phân công bài kiểm tra (chỉ admin, teacher)
 *     tags: [Test Assigns]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               classId:
 *                 type: string
 *               courseId:
 *                 type: string
 *               testId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo phân công bài kiểm tra thành công
 */
router.post("/", protect, authorize("admin", "teacher"), createTestAssign)

/**
 * @swagger
 * /test-assigns/class/{classId}:
 *   get:
 *     summary: Lấy danh sách phân công bài kiểm tra theo lớp (chỉ admin)
 *     description: Lấy danh sách phân công bài kiểm tra theo lớp (chỉ admin)
 *     tags: [Test Assigns]
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
 *         description: Danh sách phân công bài kiểm tra
 */
router.get("/class/:classId", protect, getTestAssignsByClass)

/**
 * @swagger
 * /test-assigns/course/{courseId}:
 *   get:
 *     summary: Lấy danh sách phân công bài kiểm tra theo khóa học (chỉ admin)
 *     description: Lấy danh sách phân công bài kiểm tra theo khóa học (chỉ admin)
 *     tags: [Test Assigns]
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
 *         description: Danh sách phân công bài kiểm tra
 */
router.get("/course/:courseId", protect, getTestAssignsByCourse)

/**
 * @swagger
 * /test-assigns/student/{studentId}:
 *   get:
 *     summary: Lấy danh sách phân công bài kiểm tra theo sinh viên
 *     description: Lấy danh sách phân công bài kiểm tra theo sinh viên
 *     tags: [Test Assigns]
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
 *         description: Danh sách phân công bài kiểm tra
 */
router.get("/student/:studentId", protect, getTestAssignsByStudent) 

/**
 * @swagger
 * /test-assigns/{id}:
 *   get:
 *     summary: Lấy thông tin phân công bài kiểm tra (chỉ admin)
 *     description: Lấy thông tin phân công bài kiểm tra (chỉ admin)
 *     tags: [Test Assigns]
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
 *         description: Thông tin phân công bài kiểm tra
 */
router.get("/:id", protect, getTestAssign)

/**
 * @swagger
 * /test-assigns/{id}:
 *   put:
 *     summary: Cập nhật phân công bài kiểm tra (chỉ admin, teacher)
 *     description: Cập nhật phân công bài kiểm tra (chỉ admin, teacher)
 *     tags: [Test Assigns]
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
 *               classId:
 *                 type: string
 *               courseId:
 *                 type: string
 *               testId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật phân công bài kiểm tra thành công
 */
router.put("/:id", protect, authorize("admin", "teacher"), updateTestAssign)

/**
 * @swagger
 * /test-assigns/{id}:
 *   delete:
 *     summary: Xóa phân công bài kiểm tra (chỉ admin, teacher)
 *     description: Xóa phân công bài kiểm tra (chỉ admin, teacher)
 *     tags: [Test Assigns]
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
 *         description: Xóa phân công bài kiểm tra thành công
 */
router.delete("/:id", protect, authorize("admin", "teacher"), deleteTestAssign)


/**
 * @swagger
 * /test-assigns/student/{studentId}/test/{testId}:
 *   get:
 *     summary: Lấy phân công bài kiểm tra cho sinh viên theo testId
 *     description: Lấy phân công bài kiểm tra cho sinh viên theo testId
 *     tags: [Test Assigns]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: testId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin phân công bài kiểm tra
 */
router.get(
  "/student/:studentId/test/:testId",
  protect,
  getTestAssignsForStudent
);


module.exports = router
