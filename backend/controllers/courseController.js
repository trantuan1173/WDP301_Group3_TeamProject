const Course = require("../models/courseModel.js")
const CourseDetail = require("../models/courseDetailModel.js")

// Get all courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find()

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    })
  }
}

// Get single course with details
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }

    // Get course details
    const courseDetails = await CourseDetail.find({ courseId: req.params.id })

    res.status(200).json({
      success: true,
      data: {
        ...course.toObject(),
        details: courseDetails,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch course",
      error: error.message,
    })
  }
}

// Create course
const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body)

    res.status(201).json({
      success: true,
      data: course,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    })
  }
}

// Update course
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }

    res.status(200).json({
      success: true,
      data: course,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: error.message,
    })
  }
}

// Delete course
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }

    // Delete course details
    await CourseDetail.deleteMany({ courseId: req.params.id })

    // Delete course
    await Course.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: "Course and details deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message,
    })
  }
}


module.exports={
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
}
    