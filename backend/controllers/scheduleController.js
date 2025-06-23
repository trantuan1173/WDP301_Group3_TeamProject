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

// Delete schedules by class
const deleteSchedulesByClass = async (req, res) => {
  try {
    const { classId } = req.params

    const schedules = await Schedule.deleteMany({ classId })

    res.status(200).json({
      success: true,
      count: schedules.deletedCount,
      message: "Schedules deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete schedules",
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

// Create bulk schedule
const createBulkSchedule = async (req, res) => {
  try {
    const scheduleList = req.body;

    if (!Array.isArray(scheduleList) || scheduleList.length === 0) {
      return res.status(400).json({ success: false, message: "Dữ liệu không hợp lệ" });
    }

    // Lấy classId từ phần tử đầu tiên
    const classId = scheduleList[0].classId;

    // Kiểm tra lớp có tồn tại không
    const classExists = await Class.findById(classId);
    if (!classExists) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    // Lấy toàn bộ lịch học hiện có của lớp này
    const existingSchedules = await Schedule.find({ classId });

    // Kiểm tra từng lịch mới có bị trùng không
    for (const newSchedule of scheduleList) {
      const newStart = new Date(newSchedule.start_time);
      const newEnd = new Date(newSchedule.end_time);
      const newDate = new Date(newSchedule.date).toDateString();

      const conflict = existingSchedules.some(s => {
        const existingDate = new Date(s.date).toDateString();
        const existingStart = new Date(s.start_time);
        const existingEnd = new Date(s.end_time);

        return (
          existingDate === newDate &&
          (
            (existingStart <= newStart && existingEnd > newStart) ||
            (existingStart < newEnd && existingEnd >= newEnd) ||
            (existingStart >= newStart && existingEnd <= newEnd)
          )
        );
      });

      if (conflict) {
        return res.status(400).json({
          success: false,
          message: "Có ít nhất một lịch bị trùng với lịch đã tồn tại",
        });
      }
    }

    // Nếu không có xung đột, tiến hành insert
    const result = await Schedule.insertMany(scheduleList);

    res.status(201).json({ success: true, message: "Create schedules successfully", data: result });
  } catch (error) {
    console.error("Lỗi tạo lịch:", error);
    res.status(500).json({ success: false, message: "Create schedules failed", error: error.message });
  }
};

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

// Get schedules by student
const getSchedulesByStudent = async (req, res) => {
  try {
    const { studentId } = req.params

    // Tìm tất cả lớp mà học sinh này đang học
    const classItem = await Class.find({ students: studentId });

    // Nếu không có lớp nào
    if (!classItem.length) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in any class",
      });
    }

    // Lấy danh sách classId
    const classIds = classItem.map(cls => cls._id);

    const schedules = await Schedule.find({ classId: { $in: classIds } }).populate("classId", "course")

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

// Get schedules by teacher
const getSchedulesByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params

    // Tìm tất cả lớp mà giáo viên này đang dạy
    const classItem = await Class.find({ teacherId });

    // Nếu không có lớp nào
    if (!classItem.length) {
      return res.status(404).json({
        success: false,
        message: "Teacher is not teaching any class",
      });
    }

    // Lấy danh sách classId
    const classIds = classItem.map(cls => cls._id);

    const schedules = await Schedule.find({ classId: { $in: classIds } }).populate("classId", "course")

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
module.exports = {
  getSchedules,
  getSchedulesByClass,
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getSchedulesByStudent,
  getSchedulesByTeacher,
  deleteSchedulesByClass,
  createBulkSchedule,
}
