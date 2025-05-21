const express = require("express")
const { getTestSubmissions, getStudentSubmissions } = require("../controllers/testController.js")
const { protect, authorize } = require("../middleware/authMiddleware.js")

const router = express.Router()

router.get("/:testId", protect, authorize("admin", "teacher"), getTestSubmissions)

router.get("/student/:studentId", protect, getStudentSubmissions)

module.exports = router
