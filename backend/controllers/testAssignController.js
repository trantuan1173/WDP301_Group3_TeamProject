const TestAssign = require("../models/testAssignModel.js")
const Test = require("../models/testModel.js")
const Class = require("../models/classModel.js")
const Course = require("../models/courseModel.js")

// Get all test assignments
const getTestAssigns = async (req, res) => {
  try {
    const testAssigns = await TestAssign.find()
      .populate("courseId")
      .populate("testId")
      .populate("classId")
      .populate("teacherId", "email")

    res.status(200).json({
      success: true,
      count: testAssigns.length,
      data: testAssigns,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch test assignments",
      error: error.message,
    })
  }
}

// Get test assignments by class
const getTestAssignsByClass = async (req, res) => {
  try {
    const { classId } = req.params

    const testAssigns = await TestAssign.find({ classId })
      .populate("courseId")
      .populate("testId")
      .populate("teacherId", "email")

    res.status(200).json({
      success: true,
      count: testAssigns.length,
      data: testAssigns,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch test assignments",
      error: error.message,
    })
  }
}

// Get test assignments by course
const getTestAssignsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params

    const testAssigns = await TestAssign.find({ courseId })
      .populate("testId")
      .populate("classId")
      .populate("teacherId", "email")

    res.status(200).json({
      success: true,
      count: testAssigns.length,
      data: testAssigns,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch test assignments",
      error: error.message,
    })
  }
}

// Get single test assignment
const getTestAssign = async (req, res) => {
  try {
    const testAssign = await TestAssign.findById(req.params.id)
      .populate("courseId")
      .populate("testId")
      .populate("classId")
      .populate("teacherId", "email")

    if (!testAssign) {
      return res.status(404).json({
        success: false,
        message: "Test assignment not found",
      })
    }

    res.status(200).json({
      success: true,
      data: testAssign,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch test assignment",
      error: error.message,
    })
  }
}

// Create test assignment
const createTestAssign = async (req, res) => {
  try {
    const { courseId, testId, classId, title, teacherId, startDate, dueDate } = req.body

    // Validate references
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }

    const test = await Test.findById(testId)
    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      })
    }

    const classItem = await Class.findById(classId)
    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      })
    }

    // Check if test assignment already exists for this test and class
    const existingAssignment = await TestAssign.findOne({ testId, classId })
    if (existingAssignment) {
      return res.status(400).json({
        success: false,
        message: "Test already assigned to this class",
      })
    }

    const testAssign = await TestAssign.create({
      courseId,
      testId,
      classId,
      title,
      teacherId,
      startDate,
      dueDate,
    })

    res.status(201).json({
      success: true,
      data: testAssign,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create test assignment",
      error: error.message,
    })
  }
}

// Update test assignment
const updateTestAssign = async (req, res) => {
  try {
    const testAssign = await TestAssign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!testAssign) {
      return res.status(404).json({
        success: false,
        message: "Test assignment not found",
      })
    }

    res.status(200).json({
      success: true,
      data: testAssign,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update test assignment",
      error: error.message,
    })
  }
}

// Delete test assignment
const deleteTestAssign = async (req, res) => {
  try {
    const testAssign = await TestAssign.findByIdAndDelete(req.params.id)

    if (!testAssign) {
      return res.status(404).json({
        success: false,
        message: "Test assignment not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Test assignment deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete test assignment",
      error: error.message,
    })
  }
}

module.exports = {
  getTestAssigns,
  getTestAssignsByClass,
  getTestAssignsByCourse,
  getTestAssign,
  createTestAssign,
  updateTestAssign,
  deleteTestAssign,
}   