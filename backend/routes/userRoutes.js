const express = require("express");
const { getUsers, getUser, createUser, updateUser, deleteUser, loginUser, adminCreateTeacher, verifyUser } = require("../controllers/userController.js");
const { protect, authorize } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/", protect, authorize("admin"), getUsers)

router.post("/register", createUser)

router.post("/login", loginUser)

router.get("/:id", protect, getUser)

router.put("/:id", protect, updateUser)

router.delete("/:id", protect, authorize("admin"), deleteUser)

router.post("/createTeacher", protect, authorize("admin"), adminCreateTeacher)

router.get("/verify/:token", verifyUser)

module.exports = router;

