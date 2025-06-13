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
  createVNPayUrl,
  vnpayReturn,
  vnpayIpn,
  querydr,
  refund,
} = require("../controllers/paymentController.js")
const { protect, authorize } = require("../middleware/authMiddleware.js")

const router = express.Router()


// Thanh toán VNPAY
router.get("/create_payment_url", createVNPayUrl);
router.post("/create_payment_url", createVNPayUrl);
router.get("/vnpay_return", vnpayReturn);
router.get("/vnpay_ipn", vnpayIpn);
router.post("/querydr", querydr);
router.post("/refund", refund);

router.get("/", protect, authorize("admin"), getPayments)

router.post("/", protect, createPayment)

router.get("/stats", protect, authorize("admin"), getPaymentStats)

router.get("/student/:studentId", protect, getPaymentsByStudent)

router.get("/course/:courseId", protect, authorize("admin", "teacher"), getPaymentsByCourse)

router.get("/:id", protect, getPayment)

router.put("/:id", protect, authorize("admin"), updatePayment)

router.delete("/:id", protect, authorize("admin"), deletePayment)

router.put("/:id/process", protect, authorize("admin"), processPayment)

module.exports = router
