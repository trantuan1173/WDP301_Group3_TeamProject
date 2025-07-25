const mongoose = require("mongoose");

const customerConsultingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    note: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Not Process", "Processing", "Processed"],
      default: "Not Process",
    },
  },
  { timestamps: true },
)

const CustomerConsulting = mongoose.model("CustomerConsulting", customerConsultingSchema)

module.exports = CustomerConsulting;
