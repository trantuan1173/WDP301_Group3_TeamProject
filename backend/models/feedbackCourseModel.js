const mongoose = require("mongoose");

const feedbackCourseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
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
feedbackCourseSchema.pre("save", function (next) {
  if (this.rating >= 4) {
    this.highlight = true;
  } else {
    this.highlight = false;
  }
  next();
});

// Middleware cho update 
feedbackCourseSchema.pre(["findOneAndUpdate", "updateOne", "updateMany"], function (next) {
  const update = this.getUpdate();
  if (update.rating !== undefined) {
    if (!update.$set) update.$set = {};
    update.$set.highlight = update.rating >= 4;
  }
  next();
});

const FeedbackCourse = mongoose.model("FeedbackCourse", feedbackCourseSchema)

module.exports = FeedbackCourse;
