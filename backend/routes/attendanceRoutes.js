const express = require("express");
const {
  getAttendances,
  getAttendancesByClass,
  getAttendancesByStudent,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  markBulkAttendance,
} = require("../controllers/attendanceController.js");
const { protect, authorize } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/", protect, getAttendances)

router.post("/", protect, authorize("admin", "teacher"), createAttendance)

router.post("/bulk", protect, authorize("admin", "teacher"), markBulkAttendance)

router.get("/class/:classId", protect, getAttendancesByClass)

router.get("/student/:studentId", protect, getAttendancesByStudent)

router.put("/:id", protect, authorize("admin", "teacher"), updateAttendance)


router.delete("/:id", protect, authorize("admin", "teacher"), deleteAttendance)

module.exports = router;
