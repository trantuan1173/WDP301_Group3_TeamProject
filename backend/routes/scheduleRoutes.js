const express = require("express")
const {
  getSchedules,
  getSchedulesByClass,
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} = require("../controllers/scheduleController.js")
const { protect, authorize } = require("../middleware/authMiddleware.js")

const router = express.Router()

router.get("/", protect, getSchedules)

router.post("/", protect, authorize("admin", "teacher"), createSchedule)

router.get("/class/:classId", protect, getSchedulesByClass)

router.get("/:id", protect, getSchedule)

router.put("/:id", protect, authorize("admin", "teacher"), updateSchedule)

router.delete("/:id", protect, authorize("admin", "teacher"), deleteSchedule)

module.exports = router
