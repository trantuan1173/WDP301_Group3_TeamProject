const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema(
  {
    // orderId: String, // vnp_TxnRef
    // amount: Number,
    // status: {
    //   type: String,
    //   enum: ['pending', 'success', 'failed', 'refunded'],
    //   default: 'pending'
    // },
    // vnp_TransactionNo: String,
    // vnp_ResponseCode: String,
    // vnp_OrderInfo: String,
    // vnp_BankCode: String,
    // vnp_PayDate: String,
    // vnp_TransactionDate: String,
    // vnp_CardType: String,
    // createdAt: {
    //   type: Date,
    //   default: Date.now
    // },
    // updatedAt: Date
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "bank_transfer", "paypal", "cash", "other"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    paidAt: {
      type: Date,
    },

    note: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
)

const Payment = mongoose.model("Payment", paymentSchema)

module.exports = Payment
