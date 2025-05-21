const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    nameRole: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true },
)

const Role = mongoose.model("Role", roleSchema)

module.exports = Role;
