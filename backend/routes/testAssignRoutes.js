const express = require("express")
const {
  getTestAssigns,
  getTestAssignsByClass,
  getTestAssignsByCourse,
  getTestAssign,
  createTestAssign,
  updateTestAssign,
  deleteTestAssign,
} = require("../controllers/testAssignController.js")
const { protect, authorize } = require("../middleware/authMiddleware.js")

const router = express.Router()

router.route("/").get(protect, getTestAssigns).post(protect, authorize("admin", "teacher"), createTestAssign)

router.route("/class/:classId").get(protect, getTestAssignsByClass)

router.route("/course/:courseId").get(protect, getTestAssignsByCourse)

router
  .route("/:id")
  .get(protect, getTestAssign)
  .put(protect, authorize("admin", "teacher"), updateTestAssign)
  .delete(protect, authorize("admin", "teacher"), deleteTestAssign)

module.exports = router
