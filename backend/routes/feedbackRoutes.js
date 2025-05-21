const express = require("express")
const {
  getFeedbacks,
  getFeedbacksByUser,
  getFeedback,
  createFeedback,
  updateFeedback,
  deleteFeedback,
} = require("../controllers/feedbackController.js")
const { protect, authorize } = require("../middleware/authMiddleware.js")

const router = express.Router()

router.get("/", protect, getFeedbacks)

router.post("/", protect, createFeedback)

router.get("/user/:userId", protect, getFeedbacksByUser)

router.get("/:id", protect, getFeedback)

router.put("/:id", protect, updateFeedback)

router.delete("/:id", protect, authorize("admin"), deleteFeedback)

module.exports = router
