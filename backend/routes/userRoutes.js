const express = require("express");
const { getUsers, getUser, createUser, updateUser, deleteUser, loginUser, adminCreateTeacher, verifyUser, forgotPassword, resetPassword, authProfile, updateUserByAdmin, resendVerifyEmail } = require("../controllers/userController.js");
const { protect, authorize } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/", protect, authorize("admin"), getUsers)

router.post("/register", createUser)

router.post("/login", loginUser)

router.get("/authProfile", protect, authProfile)

router.get("/:id", protect, getUser)

router.put("/:id", protect, updateUser)

router.put("/updateByAdmin/:id", protect, authorize("admin"), updateUserByAdmin)

router.delete("/:id", protect, authorize("admin"), deleteUser)

router.post("/createTeacher", protect, authorize("admin"), adminCreateTeacher)

router.get("/verify/:token", verifyUser)

router.post("/resend-verify-email", resendVerifyEmail)

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);



module.exports = router;

