const Feedback = require("../models/feedbackModel.js")
const User = require("../models/userModel.js")

// Get all feedbacks
const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate("userId", "email")

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedbacks",
      error: error.message,
    })
  }
}

// Get feedbacks by user
const getFeedbacksByUser = async (req, res) => {
  try {
    const { userId } = req.params

    const feedbacks = await Feedback.find({ userId })

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedbacks",
      error: error.message,
    })
  }
}

// Get single feedback
const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id).populate("userId", "email")

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found",
      })
    }

    res.status(200).json({
      success: true,
      data: feedback,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
      error: error.message,
    })
  }
}

// Create feedback
const createFeedback = async (req, res) => {
  try {
    const { userId, comment } = req.body

    // Check if user exists
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    const feedback = await Feedback.create({
      userId,
      comment,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })

    res.status(201).json({
      success: true,
      data: feedback,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create feedback",
      error: error.message,
    })
  }
}

// Update feedback
const updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
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
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update feedback",
      error: error.message,
    })
  }
}

// Delete feedback
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id)

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete feedback",
      error: error.message,
    })
  }
}

module.exports={
    getFeedbacks,
    getFeedbacksByUser,
    getFeedback,
    createFeedback,
    updateFeedback,
    deleteFeedback
}
    