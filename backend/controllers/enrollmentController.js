const Enrollment = require("../models/enrollmentModel.js")
const Course = require("../models/courseModel.js")
const User = require("../models/userModel.js")

// Get all enrollments
const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find().populate("courseId").populate("studentId", "email")

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrollments",
      error: error.message,
    })
  }
}

// Get enrollments by course
const getEnrollmentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params

    const enrollments = await Enrollment.find({ courseId }).populate("studentId", "email")

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrollments",
      error: error.message,
    })
  }
}

// Get enrollments by student
const getEnrollmentsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params

    const enrollments = await Enrollment.find({ studentId }).populate("courseId")

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrollments",
      error: error.message,
    })
  }
}

// Get single enrollment
const getEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id).populate("courseId").populate("studentId", "email")

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      })
    }

    res.status(200).json({
      success: true,
      data: enrollment,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrollment",
      error: error.message,
    })
  }
}

// Create enrollment
const createEnrollment = async (req, res) => {
  try {
    const { courseId, studentId, status } = req.body

    // Validate references
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }

    const student = await User.findById(studentId)
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      })
    }

    // Check if enrollment already exists
    const existingEnrollment = await Enrollment.findOne({ courseId, studentId })
    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "Student already enrolled in this course",
      })
    }

    const enrollment = await Enrollment.create({
      courseId,
      studentId,
      status: status || "pending",
      enrolledAt: Date.now(),
    })

    res.status(201).json({
      success: true,
      data: enrollment,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create enrollment",
      error: error.message,
    })
  }
}

// Update enrollment
const updateEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      })
    }

    res.status(200).json({
      success: true,
      data: enrollment,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update enrollment",
      error: error.message,
    })
  }
}

// Delete enrollment
const deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id)

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Enrollment deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete enrollment",
      error: error.message,
    })
  }
}

// Update enrollment status
const updateEnrollmentStatus = async (req, res) => {
  try {
    const { status } = req.body

    const enrollment = await Enrollment.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true })

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      })
    }

    res.status(200).json({
      success: true,
      data: enrollment,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update enrollment status",
      error: error.message,
    })
  }
}

module.exports = {
  getEnrollments,
  getEnrollmentsByCourse,
  getEnrollmentsByStudent,
  getEnrollment,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
  updateEnrollmentStatus,
}