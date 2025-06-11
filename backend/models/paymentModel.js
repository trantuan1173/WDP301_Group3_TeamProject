const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema(
  {
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
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "bank_transfer", "paypal", "cash", "other"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded", "cancelled"],
      default: "pending",
    },
    paidAt: {
      type: Date,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
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
