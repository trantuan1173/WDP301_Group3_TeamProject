const mongoose = require("mongoose");

const testSubmissionSchema = new mongoose.Schema(
  {
    testAssignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestAssign",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: [
      {
        questionIndex: Number,
        answer: String,
      },
    ],
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    feedback: {
      type: String,
      trim: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    gradedAt: {
      type: Date,
    },
  },
  { timestamps: true },
)

// Ensure a student can only submit once per test assignment
testSubmissionSchema.index({ testAssignId: 1, studentId: 1 }, { unique: true })

const TestSubmission = mongoose.model("TestSubmission", testSubmissionSchema)

module.exports = TestSubmission;
