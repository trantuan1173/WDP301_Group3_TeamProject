const Payment = require("../models/paymentModel.js")
const Course = require("../models/courseModel.js")
const User = require("../models/userModel.js")
const Enrollment = require("../models/enrollmentModel.js")

// Get all payments
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("studentId", "email").populate("courseId")

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: error.message,
    })
  }
}

// Get payments by student
const getPaymentsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params

    const payments = await Payment.find({ studentId }).populate("courseId")

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: error.message,
    })
  }
}

// Get payments by course
const getPaymentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params

    const payments = await Payment.find({ courseId }).populate("studentId", "email")

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: error.message,
    })
  }
}

// Get single payment
const getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("studentId", "email").populate("courseId")

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      })
    }

    res.status(200).json({
      success: true,
      data: payment,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment",
      error: error.message,
    })
  }
}

// Create payment
const createPayment = async (req, res) => {
  try {
    const { studentId, courseId, amount, paymentMethod, transactionId, note } = req.body

    // Validate references
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }

    const student = await User.findById(studentId)
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      })
    }

    // Check if enrollment exists
    const enrollment = await Enrollment.findOne({ courseId, studentId })
    if (!enrollment) {
      return res.status(400).json({
        success: false,
        message: "Student must be enrolled in the course before making payment",
      })
    }

    const payment = await Payment.create({
      studentId,
      courseId,
      amount,
      paymentMethod,
      status: "pending",
      transactionId,
      note,
    })

    res.status(201).json({
      success: true,
      data: payment,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create payment",
      error: error.message,
    })
  }
}

// Update payment
const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      })
    }

    res.status(200).json({
      success: true,
      data: payment,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update payment",
      error: error.message,
    })
  }
}

// Delete payment
const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id)

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete payment",
      error: error.message,
    })
  }
}

// Process payment (mark as completed)
const processPayment = async (req, res) => {
  try {
    const { transactionId } = req.body

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      {
        status: "completed",
        paidAt: Date.now(),
        transactionId,
      },
      { new: true, runValidators: true },
    )

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      })
    }

    // Update enrollment status to active if payment is completed
    await Enrollment.findOneAndUpdate(
      { courseId: payment.courseId, studentId: payment.studentId },
      { status: "active" },
    )

    res.status(200).json({
      success: true,
      data: payment,
      message: "Payment processed successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to process payment",
      error: error.message,
    })
  }
}

// Get payment statistics
const getPaymentStats = async (req, res) => {
  try {
    const totalPayments = await Payment.countDocuments()
    const completedPayments = await Payment.countDocuments({ status: "completed" })
    const pendingPayments = await Payment.countDocuments({ status: "pending" })
    const failedPayments = await Payment.countDocuments({ status: "failed" })

    const totalRevenue = await Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ])

    res.status(200).json({
      success: true,
      data: {
        totalPayments,
        completedPayments,
        pendingPayments,
        failedPayments,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment statistics",
      error: error.message,
    })
  }
}

module.exports = {
  getPayments,
  getPaymentsByStudent,
  getPaymentsByCourse,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
  processPayment,
  getPaymentStats,
}