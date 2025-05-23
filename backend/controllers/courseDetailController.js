const CourseDetail = require("../models/courseDetailModel.js")
const Course = require("../models/courseModel.js")

// Get all course details
const getCourseDetails = async (req, res) => {
  try {
    const courseDetails = await CourseDetail.find().populate("courseId")

    res.status(200).json({
      success: true,
      count: courseDetails.length,
      data: courseDetails,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch course details",
      error: error.message,
    })
  }
}

// Get course details by course
const getCourseDetailsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params

    const courseDetails = await CourseDetail.find({ courseId })

    res.status(200).json({
      success: true,
      count: courseDetails.length,
      data: courseDetails,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch course details",
      error: error.message,
    })
  }
}

// Get single course detail
const getCourseDetail = async (req, res) => {
  try {
    const courseDetail = await CourseDetail.findById(req.params.id).populate("courseId")

    if (!courseDetail) {
      return res.status(404).json({
        success: false,
        message: "Course detail not found",
      })
    }

    res.status(200).json({
      success: true,
      data: courseDetail,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch course detail",
      error: error.message,
    })
  }
}

// Create course detail
const createCourseDetail = async (req, res) => {
  try {
    const { courseId } = req.body

    // Check if course exists
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }

    const courseDetail = await CourseDetail.create(req.body)

    res.status(201).json({
      success: true,
      data: courseDetail,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create course detail",
      error: error.message,
    })
  }
}

// Update course detail
const updateCourseDetail = async (req, res) => {
  try {
    const courseDetail = await CourseDetail.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!courseDetail) {
      return res.status(404).json({
        success: false,
        message: "Course detail not found",
      })
    }

    res.status(200).json({
      success: true,
      data: courseDetail,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update course detail",
      error: error.message,
    })
  }
}

// Delete course detail
const deleteCourseDetail = async (req, res) => {
  try {
    const courseDetail = await CourseDetail.findByIdAndDelete(req.params.id)

    if (!courseDetail) {
      return res.status(404).json({
        success: false,
        message: "Course detail not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Course detail deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete course detail",
      error: error.message,
    })
  }
}


module.exports={
    getCourseDetails,
    getCourseDetailsByCourse,
    getCourseDetail,
    createCourseDetail,
    updateCourseDetail,
    deleteCourseDetail
}