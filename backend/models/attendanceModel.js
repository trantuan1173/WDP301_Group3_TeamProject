const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
)

const Attendance = mongoose.model("Attendance", attendanceSchema)

module.exports = Attendance;
