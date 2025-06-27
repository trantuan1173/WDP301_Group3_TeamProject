const FeedbackTeacher = require("../models/feedbackTeacherModel.js")
const User = require("../models/userModel.js")

// Get all feedbacks
const getAllFeedbacksAllTeacher = async (req, res) => {
  try {
    const feedbacks = await FeedbackTeacher.find().populate({
      path: "teacherId",
      select: "email profileId",
      populate: {
        path: "profileId",
        select: "name"
      }
    })

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    })
    message: "Feedbacks fetched successfully";
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedbacks",
      error: error.message,
    })
    message: "Failed to fetch feedbacks";
  }
}

// Get all feedbacks of a teacher
const getAllFeedbacksATeacher = async (req, res) => {
  try {
    const { teacherId } = req.params
    const feedbacks = await FeedbackTeacher.find({ teacherId: teacherId }).populate({
      path: "teacherId",
      select: "email profileId",
      populate: {
        path: "profileId",
        select: "name"
      }
    })

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    })
    message: "Feedbacks fetched successfully";
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedbacks",
      error: error.message,
    })
    message: "Failed to fetch feedbacks";
  }
}

// Get feedbacks of user (Admin)
const getFeedbacksTeacherByUser = async (req, res) => {
  try {
    const { studentId } = req.params
    const feedbacks = await FeedbackTeacher.find({ studentId: studentId })
      .populate({
        path: "teacherId",
        select: "email profileId",
        populate: {
          path: "profileId",
          select: "name"
        }
      })

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    })
    message: "Feedbacks fetched successfully";
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedbacks",
      error: error.message,
    })
    message: "Failed to fetch feedbacks";
  }
}

// Get highlight feedbacksTeacher
const getFeedbacksTeacherHighlight = async (req, res) => {
  try {
    const { teacherId } = req.params
    const feedbackTeacher = await FeedbackTeacher.find({ teacherId, highlight: true })
      .populate({
        path: "teacherId",
        select: "email profileId",
        populate: {
          path: "profileId",
          select: "name"
        }
      })

    if (!feedbackTeacher) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      })
    }

    res.status(200).json({
      success: true,
      data: feedbackTeacher,
    })
    message: "Feedback fetched successfully";
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
      error: error.message,
    })
    message: "Failed to fetch feedback";
  }
}

// Create feedback
const createFeedbackTeacher = async (req, res) => {
  try {
    const { studentId, teacherId, feedback, rating } = req.body

    // Check if user exists
    const teacher = await User.findById(teacherId)
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      })
    }

    const feedbackTeacher = await FeedbackTeacher.create({
      studentId,
      teacherId,
      feedback,
      rating
    })

    res.status(201).json({
      success: true,
      data: feedbackTeacher,
      message: "Feedback created successfully",
    })
    message: "Feedback created successfully";
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create feedback",
      error: error.message,
    })
    message: "Failed to create feedback";
  }
}

// Update feedback
const updateFeedbackTeacher = async (req, res) => {
  try {
    const feedback = await FeedbackTeacher.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      {
        new: true,
        runValidators: true,
      },
    )

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      })
    }

    res.status(200).json({
      success: true,
      data: feedback,
      message: "Feedback updated successfully",
    })
    message: "Feedback updated successfully";
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update feedback",
      error: error.message,
    })
    message: "Failed to update feedback";
  }
}

// Delete feedback
const deleteFeedbackTeacher = async (req, res) => {
  try {
    const feedback = await FeedbackTeacher.findByIdAndDelete(req.params.id)

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
    })
    message: "Feedback deleted successfully";
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete feedback",
      error: error.message,
    })
    message: "Failed to delete feedback";
  }
}

// Highlight feedback
const highlightFeedbackTeacher = async (req, res) => {
  try {
    const feedback = await FeedbackTeacher.findById(req.params.id)
    const highlight = req.body.highlight
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      })
    }
    feedback.highlight = highlight
    await feedback.save()
    res.status(200).json({
      success: true,
      data: feedback,
      message: "Feedback highlighted successfully",
    })
    message: "Feedback highlighted successfully";
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to highlight feedback",
      error: error.message,
    })
    message: "Failed to highlight feedback";
  }
}

module.exports={
    getAllFeedbacksAllTeacher,
    getAllFeedbacksATeacher,
    getFeedbacksTeacherByUser,
    getFeedbacksTeacherHighlight,
    createFeedbackTeacher,
    updateFeedbackTeacher,
    deleteFeedbackTeacher,
    highlightFeedbackTeacher
}
    