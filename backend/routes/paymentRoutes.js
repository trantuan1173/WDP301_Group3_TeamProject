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
router.post("/querydr", querydr);
router.get("/create_payment_url", createVNPayUrl);
router.post("/create_payment_url", createVNPayUrl);
router.get("/vnpay_return", vnpayReturn);
router.get("/vnpay_ipn", vnpayIpn);

router.post("/refund", refund);

router.get("/", getPayments)

router.post("/", createPayment)

router.get("/stats", getPaymentStats)

router.get("/student/:studentId", getPaymentsByStudent)

router.get("/course/:courseId", getPaymentsByCourse)

router.get("/:id", getPayment)

router.put("/:id", protect, authorize("admin"), updatePayment)

router.delete("/:id", protect, authorize("admin"), deletePayment)

router.put("/:id/process", protect, authorize("admin"), processPayment)

module.exports = router
