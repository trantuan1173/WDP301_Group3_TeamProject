const express = require("express")
const {
  getPayments,
  getPaymentsByStudent,
  getPaymentsByCourse,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
  processPayment,
  getPaymentStats,
} = require("../controllers/paymentController.js")
const { protect, authorize } = require("../middleware/authMiddleware.js")

const router = express.Router()

router.route("/").get(protect, authorize("admin"), getPayments).post(protect, createPayment)

router.route("/stats").get(protect, authorize("admin"), getPaymentStats)

router.route("/student/:studentId").get(protect, getPaymentsByStudent)

router.route("/course/:courseId").get(protect, authorize("admin", "teacher"), getPaymentsByCourse)

router
  .route("/:id")
  .get(protect, getPayment)
  .put(protect, authorize("admin"), updatePayment)
  .delete(protect, authorize("admin"), deletePayment)

router.route("/:id/process").put(protect, authorize("admin"), processPayment)

module.exports = router
