const Schedule = require("../models/scheduleModel.js")
const Class = require("../models/classModel.js")

// Get all schedules
const getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().populate("classId")

    res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch schedules",
      error: error.message,
    })
  }
}

// Get schedules by class
const getSchedulesByClass = async (req, res) => {
  try {
    const { classId } = req.params

    const schedules = await Schedule.find({ classId })

    res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch schedules",
      error: error.message,
    })
  } 
}

// Get single schedule
const getSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id).populate("classId")

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      })
    }

    res.status(200).json({
      success: true,
      data: schedule,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch schedule",
      error: error.message,
    })
  }
}

// Create schedule
const createSchedule = async (req, res) => {
  try {
    const { classId, date, start_time, end_time } = req.body

    // Check if class exists
    const classExists = await Class.findById(classId)
    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      })
    }

    // Check for schedule conflicts
    const conflictingSchedule = await Schedule.findOne({
      classId,
      $or: [
        {
          start_time: { $lte: new Date(start_time) },
          end_time: { $gte: new Date(start_time) },
        },
        {
          start_time: { $lte: new Date(end_time) },
          end_time: { $gte: new Date(end_time) },
        },
        {
          start_time: { $gte: new Date(start_time) },
          end_time: { $lte: new Date(end_time) },
        },
      ],
    })

    if (conflictingSchedule) {
      return res.status(400).json({
        success: false,
        message: "Schedule conflicts with an existing schedule",
      })
    }

    const schedule = await Schedule.create({
      classId,
      date,
      start_time,
      end_time,
    })

    res.status(201).json({
      success: true,
      data: schedule,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create schedule",
      error: error.message,
    })
  }
}

// Update schedule
const updateSchedule = async (req, res) => {
  try {
    const { classId, date, start_time, end_time } = req.body

    // Check for schedule conflicts if times are being updated
    if (start_time && end_time) {
      const conflictingSchedule = await Schedule.findOne({
        _id: { $ne: req.params.id },
        classId: classId || (await Schedule.findById(req.params.id)).classId,
        $or: [
          {
            start_time: { $lte: new Date(start_time) },
            end_time: { $gte: new Date(start_time) },
          },
          {
            start_time: { $lte: new Date(end_time) },
            end_time: { $gte: new Date(end_time) },
          },
          {
            start_time: { $gte: new Date(start_time) },
            end_time: { $lte: new Date(end_time) },
          },
        ],
      })

      if (conflictingSchedule) {
        return res.status(400).json({
          success: false,
          message: "Schedule conflicts with an existing schedule",
        })
      }
    }

    const schedule = await Schedule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      })
    }

    res.status(200).json({
      success: true,
      data: schedule,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update schedule",
      error: error.message,
    })
  }
}

// Delete schedule
const deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id)

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Schedule deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete schedule",
      error: error.message,
    })
  }
}

module.exports={
    getSchedules,
    getSchedulesByClass,
    getSchedule,
    createSchedule,
    updateSchedule,
    deleteSchedule
}
    