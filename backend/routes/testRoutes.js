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

router.get("/", protect, getTests)

router.post("/", protect, authorize("admin", "teacher"), createTest)

router.get("/class/:classId", protect, getTestsByClass)

router.get("/:id", protect, getTest)

router.put("/:id", protect, authorize("admin", "teacher"), updateTest)

router.delete("/:id", protect, authorize("admin", "teacher"), deleteTest)

router.post("/submit", protect, submitTest)

router.get("/:testId/submissions", protect, authorize("admin", "teacher"), getTestSubmissions)

router.get("/submissions/student/:studentId", protect, getStudentSubmissions)

module.exports = router;
