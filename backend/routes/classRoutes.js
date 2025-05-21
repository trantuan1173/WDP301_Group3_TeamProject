const express = require("express");
const {
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
  addStudentToClass,
  removeStudentFromClass,
} = require("../controllers/classController.js");
const { protect, authorize } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/", protect, getClasses)

router.post("/", protect, authorize("admin", "teacher"), createClass)

router.get("/:id", protect, getClass)

router.put("/:id", protect, authorize("admin", "teacher"), updateClass)

router.delete("/:id", protect, authorize("admin"), deleteClass)

router.post("/:id/students", protect, authorize("admin", "teacher"), addStudentToClass)

router.delete("/:id/students", protect, authorize("admin", "teacher"), removeStudentFromClass)

module.exports = router;
