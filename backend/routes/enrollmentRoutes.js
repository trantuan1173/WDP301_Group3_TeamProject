const express = require("express")
const {
  getEnrollments,
  getEnrollmentsByCourse,
  getEnrollmentsByStudent,
  getEnrollment,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
  updateEnrollmentStatus,
} = require("../controllers/enrollmentController.js")
const { protect, authorize } = require("../middleware/authMiddleware.js")

const router = express.Router()

router.route("/").get(protect, getEnrollments).post(protect, createEnrollment)

router.route("/course/:courseId").get(protect, getEnrollmentsByCourse)

router.route("/student/:studentId").get(protect, getEnrollmentsByStudent)

router
  .route("/:id")
  .get(protect, getEnrollment)
  .put(protect, authorize("admin", "teacher"), updateEnrollment)
  .delete(protect, authorize("admin"), deleteEnrollment)

router.route("/:id/status").put(protect, authorize("admin", "teacher"), updateEnrollmentStatus)

module.exports = router

