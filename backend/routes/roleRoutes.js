const express = require("express")
const { getRoles, getRole, createRole, updateRole, deleteRole } = require("../controllers/roleController.js")
const { protect, authorize } = require("../middleware/authMiddleware.js")

const router = express.Router()

router.get("/", protect, authorize("admin"), getRoles)

router.post("/", protect, authorize("admin"), createRole)

router.get("/:id", protect, getRole)

router.put("/:id", protect, authorize("admin"), updateRole)

router.delete("/:id", protect, authorize("admin"), deleteRole)

module.exports = router
