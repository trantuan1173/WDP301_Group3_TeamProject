const Class = require("../models/classModel.js");

// Get all classes
const getClasses = async function(req, res) {
  try {
    const classes = await Class.find().populate("teacherId", "email").populate("students", "email").populate("courseId")

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch classes",
      error: error.message,
    })
  }
}

// Get single class
const getClass = async function(req, res) {
  try {
    const classItem = await Class.findById(req.params.id)
      .populate("teacherId", "email")
      .populate("students", "email")
      .populate("courseId")

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      })
    }

    res.status(200).json({
      success: true,
      data: classItem,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch class",
      error: error.message,
    })
  }
}

// Create class
const createClass = async function(req, res) {
  try {
    const classItem = await Class.create(req.body)

    res.status(201).json({
      success: true,
      data: classItem,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create class",
      error: error.message,
    })
  }
}

// Update class
const updateClass = async (req, res) => {
  try {
    const classItem = await Class.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      {
        new: true,
        runValidators: true,
      },
    )

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      })
    }

    res.status(200).json({
      success: true,
      data: classItem,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update class",
      error: error.message,
    })
  }
}

// Delete class
const deleteClass = async (req, res) => {
  try {
    const classItem = await Class.findByIdAndDelete(req.params.id)

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Class deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete class",
      error: error.message,
    })
  }
}

// Add student to class
const addStudentToClass = async (req, res) => {
  try {
    const { studentId } = req.body

    const classItem = await Class.findById(req.params.id)

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      })
    }

    // Check if student already exists in class
    if (classItem.students.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Student already in class",
      })
    }

    classItem.students.push(studentId)
    await classItem.save()

    res.status(200).json({
      success: true,
      data: classItem,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add student to class",
      error: error.message,
    })
  }
}

// Remove student from class
const removeStudentFromClass = async (req, res) => {
  try {
    const { studentId } = req.body

    const classItem = await Class.findById(req.params.id)

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      })
    }

    // Check if student exists in class
    if (!classItem.students.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Student not in class",
      })
    }

    classItem.students = classItem.students.filter((student) => student.toString() !== studentId)
    await classItem.save()

    res.status(200).json({
      success: true,
      data: classItem,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove student from class",
      error: error.message,
    })
  }
}

module.exports = {
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
  addStudentToClass,
  removeStudentFromClass,
}

