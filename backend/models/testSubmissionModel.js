const mongoose = require("mongoose");

const testSubmissionSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
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
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

const TestSubmission = mongoose.model("TestSubmission", testSubmissionSchema)

module.exports = TestSubmission;
