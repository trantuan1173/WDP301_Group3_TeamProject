const Attendance = require("../models/attendanceModel.js");
const Class = require("../models/classModel.js");

// Get all attendances
const getAttendances = async function(req, res) {
  try {
    const attendances = await Attendance.find().populate("classId").populate("studentId")

    res.status(200).json({
      success: true,
      count: attendances.length,
      data: attendances,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendances",
      error: error.message,
    })
  }
}

// Get attendances by class
const getAttendancesByClass = async function(req, res) {
  try {
    const { classId } = req.params

    const attendances = await Attendance.find({ classId }).populate("studentId")

    res.status(200).json({
      success: true,
      count: attendances.length,
      data: attendances,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendances",
      error: error.message,
    })
  }
}

// Get attendances by student
const getAttendancesByStudent = async function(req, res) {
  try {
    const { studentId } = req.params

    const attendances = await Attendance.find({ studentId }).populate("classId")

    res.status(200).json({
      success: true,
      count: attendances.length,
      data: attendances,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendances",
      error: error.message,
    })
  }
}

// Create attendance
const createAttendance = async (req, res) => {
  try {
    const { classId, studentId, date, status, note } = req.body

    // Check if class exists
    const classExists = await Class.findById(classId)
    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      })
    }

    // Check if student is in class
    if (!classExists.students.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Student not in class",
      })
    }

    // Check if attendance already exists
    const existingAttendance = await Attendance.findOne({
      classId,
      studentId,
      date: new Date(date),
    })

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance already recorded for this date",
      })
    }

    const attendance = await Attendance.create({
      classId,
      studentId,
      date,
      status,
      note,
    })

    res.status(201).json({
      success: true,
      data: attendance,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create attendance",
      error: error.message,
    })
  }
}

// Update attendance
const updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      })
    }

    res.status(200).json({
      success: true,
      data: attendance,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update attendance",
      error: error.message,
    })
  }
}

// Delete attendance
const deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id)

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Attendance deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete attendance",
      error: error.message,
    })
  }
}

// Mark attendance for multiple students
const markBulkAttendance = async (req, res) => {
  try {
    const { classId, date, attendances } = req.body

    // Check if class exists
    const classExists = await Class.findById(classId)
    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      })
    }

    const results = []

    // Process each attendance record
    for (const record of attendances) {
      const { studentId, status, note } = record

      // Check if student is in class
      if (!classExists.students.includes(studentId)) {
        results.push({
          studentId,
          success: false,
          message: "Student not in class",
        })
        continue
      }

      // Check if attendance already exists
      const existingAttendance = await Attendance.findOne({
        classId,
        studentId,
        date: new Date(date),
      })

      if (existingAttendance) {
        // Update existing attendance
        const updated = await Attendance.findByIdAndUpdate(existingAttendance._id, { status, note }, { new: true })

        results.push({
          studentId,
          success: true,
          data: updated,
          message: "Attendance updated",
        })
      } else {
        // Create new attendance
        const attendance = await Attendance.create({
          classId,
          studentId,
          date,
          status,
          note,
        })

        results.push({
          studentId,
          success: true,
          data: attendance,
          message: "Attendance created",
        })
      }
    }

    res.status(200).json({
      success: true,
      data: results,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to mark bulk attendance",
      error: error.message,
    })
  }
}

module.exports = {
  getAttendances,
  getAttendancesByClass,
  getAttendancesByStudent,
  createAttendance,
  updateAttendance,
  deleteAttendance,
  markBulkAttendance,
}
