const mongoose = require("mongoose");

const courseDetailSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
      enum: ["toeic", "ielts"],
    },
    level: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    durationDays: {
      type: Number,
      required: true,
    },
    imageURL: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true },
)

const CourseDetail = mongoose.model("CourseDetail", courseDetailSchema)

module.exports = CourseDetail;
