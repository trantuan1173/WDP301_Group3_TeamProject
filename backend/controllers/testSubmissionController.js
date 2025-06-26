const TestSubmission = require("../models/testSubmissionModel.js")
const TestAssign = require("../models/testAssignModel.js")
const Test = require("../models/testModel.js")
const User = require("../models/userModel.js")

// Get all test submissions
const getTestSubmissions = async (req, res) => {
  try {
    const submissions = await TestSubmission.find().populate("testAssignId").populate("studentId", "email")

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch test submissions",
      error: error.message,
    })
  }
}

// Get test submissions by test assignment
const getSubmissionsByTestAssign = async (req, res) => {
  try {
    const { testAssignId } = req.params

    const submissions = await TestSubmission.find({ testAssignId }).populate("studentId", "email")

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch test submissions",
      error: error.message,
    })
  }
}

// Get test submissions by student
const getSubmissionsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params

    const submissions = await TestSubmission.find({ studentId }).populate("testAssignId")

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch student submissions",
      error: error.message,
    })
  }
}

// Get single test submission
const getTestSubmission = async (req, res) => {
  try {
    const submission = await TestSubmission.findById(req.params.id)
      .populate("testAssignId")
      .populate("studentId", "email")

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Test submission not found",
      })
    }

    res.status(200).json({
      success: true,
      data: submission,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch test submission",
      error: error.message,
    })
  }
}

// Submit test (create submission)
const submitTest = async (req, res) => {
  try {
    const { testAssignId, studentId, answers } = req.body

    // Check if test assignment exists
    const testAssign = await TestAssign.findById(testAssignId).populate("testId")
    if (!testAssign) {
      return res.status(404).json({
        success: false,
        message: "Test assignment not found",
      })
    }

    // Check if student exists
    const student = await User.findById(studentId)
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      })
    }

    // Check if submission already exists
    const existingSubmission = await TestSubmission.findOne({
      testAssignId,
      studentId,
    })

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted this test",
      })
    }

    // Get the test to calculate score
    const test = await Test.findById(testAssign.testId)
    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      })
    }

    // Calculate score
    let correctAnswers = 0
    answers.forEach((answer) => {
      if (
        test.questions[answer.questionIndex] &&
        answer.answer === test.questions[answer.questionIndex].correctAnswer
      ) {
        correctAnswers++
      }
    })

    // Calculate percentage
    const percentage = (correctAnswers / test.questions.length) * 100

    // Create submission
    const submission = await TestSubmission.create({
      testAssignId,
      studentId,
      answers,
      score: percentage,
      submittedAt: Date.now(),
    })

    res.status(201).json({
      success: true,
      data: submission,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit test",
      error: error.message,
    })
  }
}

// Update test submission
const updateTestSubmission = async (req, res) => {
  try {
    const submission = await TestSubmission.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Test submission not found",
      })
    }

    res.status(200).json({
      success: true,
      data: submission,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update test submission",
      error: error.message,
    })
  }
}

// Delete test submission
const deleteTestSubmission = async (req, res) => {
  try {
    const submission = await TestSubmission.findByIdAndDelete(req.params.id)

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Test submission not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Test submission deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete test submission",
      error: error.message,
    })
  }
}

// Grade test submission (for teachers)
const gradeTestSubmission = async (req, res) => {
  try {
    const { score, feedback } = req.body

    const submission = await TestSubmission.findByIdAndUpdate(
      req.params.id,
      {
        score: score || submission.score,
        feedback: feedback || submission.feedback,
        gradedAt: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      },
    )

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Test submission not found",
      })
    }

    res.status(200).json({
      success: true,
      data: submission,
      message: "Test submission graded successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to grade test submission",
      error: error.message,
    })
  }
}

// Get submission statistics
const getSubmissionStats = async (req, res) => {
  try {
    const { testAssignId } = req.params

    const submissions = await TestSubmission.find({ testAssignId })

    if (submissions.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalSubmissions: 0,
          averageScore: 0,
          highestScore: 0,
          lowestScore: 0,
          passRate: 0,
        },
      })
    }

    const scores = submissions.map((sub) => sub.score)
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length
    const highestScore = Math.max(...scores)
    const lowestScore = Math.min(...scores)
    const passedSubmissions = scores.filter((score) => score >= 60).length
    const passRate = (passedSubmissions / scores.length) * 100

    res.status(200).json({
      success: true,
      data: {
        totalSubmissions: submissions.length,
        averageScore: Math.round(averageScore * 100) / 100,
        highestScore,
        lowestScore,
        passRate: Math.round(passRate * 100) / 100,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch submission statistics",
      error: error.message,
    })
  }
}

module.exports = {
  getTestSubmissions,
  getSubmissionsByTestAssign,
  getSubmissionsByStudent,
  getTestSubmission,
  submitTest,
  updateTestSubmission,
  deleteTestSubmission,
  gradeTestSubmission,
  getSubmissionStats,
}
