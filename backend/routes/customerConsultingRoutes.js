const express = require("express");
const router = express.Router();
const { createCustomerConsulting, getAllCustomerConsulting, updateCustomerConsulting, deleteCustomerConsulting } = require("../controllers/customerConsultingController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", createCustomerConsulting);
router.get("/", protect, authorize("admin"), getAllCustomerConsulting);
router.put("/:id", protect, authorize("admin"), updateCustomerConsulting);
router.delete("/:id", protect, authorize("admin"), deleteCustomerConsulting);

module.exports = router;
