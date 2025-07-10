const express = require("express")
const {
    getTestSubmissions,
    getSubmissionsByTestAssign,
    getSubmissionsByStudent,
    getTestSubmission,
    submitTest,
    updateTestSubmission,
    deleteTestSubmission,
    gradeTestSubmission,
    getSubmissionStats,
    getStudentScoresByTestAssign,
} = require("../controllers/testSubmissionController.js")
const { protect, authorize } = require("../middleware/authMiddleware.js")

const router = express.Router()
/**
 * @swagger
 * tags:
 *   name: Test Submissions
 *   description: Quản lý bài kiểm tra đã submit
 */


/**
 * @swagger
 * /testSubmissions:
 *   get:
 *     summary: Lấy danh sách bài kiểm tra đã submit (chỉ admin, teacher)
 *     description: Lấy danh sách bài kiểm tra đã submit (chỉ admin, teacher)
 *     tags: [Test Submissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách bài kiểm tra đã submit
 */
router.get("/", protect, authorize("admin", "teacher"), getTestSubmissions)

/**
 * @swagger
 * /testSubmissions/submit:
 *   post:
 *     summary: Submit bài kiểm tra (chỉ student)
 *     description: Submit bài kiểm tra (chỉ student)
 *     tags: [Test Submissions]
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
 * /testSubmissions/test-assign/{testAssignId}:
 *   get:
 *     summary: Lấy danh sách bài kiểm tra đã submit theo test assign (chỉ admin, teacher)
 *     description: Lấy danh sách bài kiểm tra đã submit theo test assign (chỉ admin, teacher)
 *     tags: [Test Submissions]
 *     parameters:
 *       - in: path
 *         name: testAssignId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách bài kiểm tra đã submit theo test assign
 */
router.get("/test-assign/:testAssignId", protect, authorize("admin", "teacher"), getSubmissionsByTestAssign)

router.get( "/scores-by-test-assign/:testAssignId", protect, authorize("admin", "teacher"),getStudentScoresByTestAssign);
  
/**
 * @swagger
 * /testSubmissions/test-assign/{testAssignId}/stats:
 *   get:
 *     summary: Lấy thống kê bài kiểm tra đã submit theo test assign (chỉ admin, teacher)
 *     description: Lấy thống kê bài kiểm tra đã submit theo test assign (chỉ admin, teacher)
 *     tags: [Test Submissions]
 *     parameters:
 *       - in: path
 *         name: testAssignId
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thống kê bài kiểm tra đã submit theo test assign
 */
router.get("/test-assign/:testAssignId/stats", protect, authorize("admin", "teacher"), getSubmissionStats)

/**
 * @swagger
 * /testSubmissions/student/{studentId}:
 *   get:
 *     summary: Lấy danh sách bài kiểm tra đã submit theo sinh viên (chỉ admin, teacher)
 *     description: Lấy danh sách bài kiểm tra đã submit theo sinh viên (chỉ admin, teacher)
 *     tags: [Test Submissions]
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
 *         description: Danh sách bài kiểm tra đã submit theo sinh viên
 */
router.get("/student/:studentId", protect, getSubmissionsByStudent)

/**
 * @swagger
 * /testSubmissions/{id}:
 *   get:
 *     summary: Lấy thông tin bài kiểm tra đã submit (chỉ admin, teacher)
 *     description: Lấy thông tin bài kiểm tra đã submit (chỉ admin, teacher)
 *     tags: [Test Submissions]
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
 *         description: Thông tin bài kiểm tra đã submit
 */
router.get("/:id", protect, getTestSubmission)

/**
 * @swagger
 * /testSubmissions/{id}:
 *   put:
 *     summary: Cập nhật thông tin bài kiểm tra đã submit (chỉ admin, teacher)
 *     description: Cập nhật thông tin bài kiểm tra đã submit (chỉ admin, teacher)
 *     tags: [Test Submissions]
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
 *         description: Cập nhật thông tin bài kiểm tra đã submit thành công
 */
router.put("/:id", protect, authorize("admin", "teacher"), updateTestSubmission)

/**
 * @swagger
 * /testSubmissions/{id}:
 *   delete:
 *     summary: Xóa bài kiểm tra đã submit (chỉ admin, teacher)
 *     description: Xóa bài kiểm tra đã submit (chỉ admin, teacher)
 *     tags: [Test Submissions]
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
 *         description: Xóa bài kiểm tra đã submit thành công
 */
router.delete("/:id", protect, authorize("admin", "teacher"), deleteTestSubmission)

/**
 * @swagger
 * /testSubmissions/{id}/grade:
 *   put:
 *     summary: Đánh giá bài kiểm tra đã submit (chỉ admin, teacher)
 *     description: Đánh giá bài kiểm tra đã submit (chỉ admin, teacher)
 *     tags: [Test Submissions]
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
 *               grade:
 *                 type: number
 *     responses:
 *       200:
 *         description: Đánh giá bài kiểm tra đã submit thành công
 */
router.put("/:id/grade", protect, authorize("admin", "teacher"), gradeTestSubmission)



module.exports = router
