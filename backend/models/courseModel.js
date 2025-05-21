const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    nameCourses: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
)

const Course = mongoose.model("Course", courseSchema)

module.exports = Course;
