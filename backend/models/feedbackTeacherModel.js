const mongoose = require("mongoose");

const feedbackTeacherSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    feedback: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    highlight: {
      type: Boolean,
      default: false,
    },
  },  
  { timestamps: true },
)

// Middleware cho save 
feedbackTeacherSchema.pre("save", function (next) {
  if (this.rating >= 4) {
    this.highlight = true;
  } else {
    this.highlight = false;
  }
  next();
});

// Middleware cho update 
feedbackTeacherSchema.pre(["findOneAndUpdate", "updateOne", "updateMany"], function (next) {
  const update = this.getUpdate();
  if (update.rating !== undefined) {
    if (!update.$set) update.$set = {};
    update.$set.highlight = update.rating >= 4;
  }
  next();
});

const FeedbackTeacher = mongoose.model("FeedbackTeacher", feedbackTeacherSchema)

module.exports = FeedbackTeacher;
