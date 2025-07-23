const mongoose = require("mongoose");

const learningMaterialSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String, 
      required: true,
    },
    fileType: {
      type: String, // pdf, docx, pptx, etc.
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LearningMaterial", learningMaterialSchema);