const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
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
    start_time: {
      type: Date,
      required: true,
    },
    end_time: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
)

const Schedule = mongoose.model("Schedule", scheduleSchema)

module.exports = Schedule;
