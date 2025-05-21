const express = require("express")
const { getCourses, getCourse, createCourse, updateCourse, deleteCourse } = require("../controllers/courseController.js")
const { protect, authorize } = require("../middleware/authMiddleware.js")

const router = express.Router()

router.get("/", protect, getCourses)

router.post("/", protect, authorize("admin"), createCourse)

router.get("/:id", protect, getCourse)

router.put("/:id", protect, authorize("admin"), updateCourse)

router.delete("/:id", protect, authorize("admin"), deleteCourse)

module.exports = router
