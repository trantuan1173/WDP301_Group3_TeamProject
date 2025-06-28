const express = require("express");
const router = express.Router();
const FeedbackCourse = require("../models/feedbackCourseModel.js");
const User = require("../models/userModel.js");
const Course = require("../models/courseModel.js");

// Get all feedbacks (Admin)
const getAllFeedbacksAllCourse = async (req, res) => {
  try {
    const feedbacks = await FeedbackCourse.find()
    .populate({
      path: "userId",
      select: "email profileId",
      populate: {
        path: "profileId",
        select: "name"
      }
    })
    .populate({
      path: "courseId"
    })
    res.status(200).send({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    })
    message: "Feedbacks fetched successfully";
  } catch (error) {
    res.status(500).send(error)
    message: "Failed to fetch feedbacks";
  }
}

//Get feedbacks by course (User)
const getAllFeedbacksACourse = async (req, res) => {
  try {
    const { courseId } = req.params
    const feedbacks = await FeedbackCourse.find({ courseId })
    .populate({
      path: "userId",
      select: "email profileId",
      populate: {
        path: "profileId",
        select: "name"
      }
    })
    .populate({
      path: "courseId"
    })
    res.status(200).send({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    })
    message: "Feedbacks fetched successfully";
  } catch (error) {
    res.status(500).send(error)
    message: "Failed to fetch feedbacks";
  }
}

// Get feedbacks of user (Admin)
const getAllFeedbacksCourseByUser = async (req, res) => {
  try {
    const { userId } = req.params
    const feedbacks = await FeedbackCourse.find({ userId })
    .populate({
      path: "userId",
      select: "email profileId",
      populate: {
        path: "profileId",
        select: "name"
      }
    })
    .populate({
      path: "courseId"
    })
    res.status(200).send({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    })
    message: "Feedbacks fetched successfully";
  } catch (error) {
    res.status(500).send(error)
    message: "Failed to fetch feedbacks";
  }
}

// Get highlight feedbacksCourse
const getFeedbackCourseHighlight = async (req, res) => {
  try {
    const { courseId } = req.params
    const feedback = await FeedbackCourse.find({courseId, highlight: true})
    .populate({
      path: "userId",
      select: "email profileId",
      populate: {
        path: "profileId",
        select: "name"
      }
    })
    .populate({
      path: "courseId"
    })
    if (!feedback) {
      return res.status(404).send("Feedback not found");
    }
    res.status(200).send({
      success: true,
      data: feedback,
    })
    message: "Feedback fetched successfully";
  } catch (error) {
    res.status(500).send(error)
    message: "Failed to fetch feedback";
  }
}

// Get highlight feedbacksCourse for home
const getFeedbackCourseHighlightForHome = async (req, res) => {
  try {
    const feedback = await FeedbackCourse.find({highlight: true})
    .populate({
      path: "userId",
      select: "email profileId",
      populate: {
        path: "profileId",
        select: "name"
      }
    })
    .populate({
      path: "courseId"
    })

    if (!feedback) {
      return res.status(404).send("Feedback not found");
    }
    res.status(200).send({
      success: true,
      count: feedback.length,
      data: feedback,
    })
    message: "Feedback fetched successfully";
  } catch (error) {
    res.status(500).send(error)
    message: "Failed to fetch feedback";
  }
}

// Create feedback
const createFeedbackCourse = async (req, res) => {
  try {
    const { userId, courseId, feedback, rating } = req.body;
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);
    if (!user || !course) {
      return res.status(404).send("User or course not found");
    }
    const feedbackCourse = new FeedbackCourse({
      userId,
      courseId,
      feedback,
      rating,
    });
    await feedbackCourse.save();
    res.status(201).send({
      success: true,
      data: feedbackCourse,
    })
    message: "Feedback created successfully";
  } catch (error) {
    res.status(400).send(error);
    message: "Failed to create feedback";
  }
}

// Update feedback
const updateFeedbackCourse = async (req, res) => {
  try {
    const feedback = await FeedbackCourse.findOneAndUpdate(
      {_id: req.params.id}, 
      {...req.body},
      {
        new: true,
        runValidators: true,
      },
    );
    if (!feedback) {
      return res.status(404).send("Feedback not found");
    }
    res.status(200).send({
      success: true,
      data: feedback,
    })
    message: "Feedback updated successfully";
  } catch (error) {
    res.status(400).send(error);
    message: "Failed to update feedback";
  }
}

// Delete feedback
const deleteFeedbackCourse = async (req, res) => {
  try {
    const { id } = req.params
    const feedback = await FeedbackCourse.findByIdAndDelete({_id: id});
    if (!feedback) {
      return res.status(404).send("Feedback not found");
    }
    res.status(200).send({
      success: true,
      data: feedback,
    })
    message: "Feedback deleted successfully";
  } catch (error) {
    res.status(500).send(error);
    message: "Failed to delete feedback";
  }
}

// Highlight feedback for home page by admin
const highlightFeedbackCourse = async (req, res) => {
  try {
    const feedback = await FeedbackCourse.findById(req.params.id)
    const highlight = req.body.highlight
    if (!feedback) {
      return res.status(404).send("Feedback not found");
    }

    feedback.highlight = highlight;
    await feedback.save();
    res.status(200).send({
      success: true,
      data: feedback,
      message: "Feedback highlighted successfully",
    })
  } catch (error) {
    res.status(500).send(error);
    message: "Failed to highlight feedback";
  }
}


module.exports = {
  getAllFeedbacksAllCourse,
  getAllFeedbacksACourse,
  getAllFeedbacksCourseByUser,
  getFeedbackCourseHighlight,
  getFeedbackCourseHighlightForHome,
  createFeedbackCourse,
  updateFeedbackCourse,
  deleteFeedbackCourse,
  highlightFeedbackCourse,
};