const mongoose = require("mongoose")

const enrollmentSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "completed", "cancelled", "suspended"],
      default: "pending",
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

// Ensure a student can only enroll once per course
enrollmentSchema.index({ courseId: 1, studentId: 1 }, { unique: true })

const Enrollment = mongoose.model("Enrollment", enrollmentSchema)

module.exports = Enrollment
