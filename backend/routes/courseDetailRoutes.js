const express = require("express")
const {
  getCourseDetails,
  getCourseDetailsByCourse,
  getCourseDetail,
  createCourseDetail,
  updateCourseDetail,
  deleteCourseDetail,
  getCourseDetailsForGuest,
} = require("../controllers/courseDetailController.js")
const { protect, authorize } = require("../middleware/authMiddleware.js")

const router = express.Router()

router.get("/", getCourseDetails)

router.get("/forguest", getCourseDetailsForGuest)

router.post("/", protect, authorize("admin"), createCourseDetail)

router.get("/course/:courseId", protect, getCourseDetailsByCourse)

router.get("/:id", protect, getCourseDetail)

router.put("/:id", protect, authorize("admin"), updateCourseDetail)

router.delete("/:id", protect, authorize("admin"), deleteCourseDetail)



module.exports = router
