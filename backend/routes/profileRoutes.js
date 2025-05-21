const express = require("express")
const {
  getProfiles,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
} = require("../controllers/profileController.js")
const { protect, authorize } = require("../middleware/authMiddleware.js")

const router = express.Router()

router.get("/", protect, getProfiles)

router.post("/", protect, createProfile)

router.get("/:id", protect, getProfile)

router.put("/:id", protect, updateProfile)

router.delete("/:id", protect, authorize("admin"), deleteProfile)

module.exports = router
