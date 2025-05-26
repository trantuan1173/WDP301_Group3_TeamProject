const User = require("../models/userModel.js");
const Profile = require("../models/profileModel.js");
const Role = require("../models/roleModel.js");
const jwt = require("jsonwebtoken");
const sendVerifyEmail = require("../service/sendVerifyEmail");

// Generate JWT token
function generateToken(id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET || "your_jwt_secret", {
    expiresIn: "2h"
  });
}

const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");//2 chu so
  const month = String(d.getMonth() + 1).padStart(2, "0");//so co 2 chu so
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}

// Get all users
const getUsers = async function (req, res) {
  try {
    const users = await User.find().populate("profileId").populate("roleId")

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    })
  }
}

// Get single user
const getUser = async function (req, res) {
  try {
    const user = await User.findById(req.params.id).populate("profileId").populate("roleId")

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    const profileObj = user.profileId.toObject();
    const data = {
      _id: user._id,
      email: user.email,
      isVerified: user.isVerified,
      role: user.roleId.nameRole,
      profile: {
        ...profileObj,
        dob: profileObj.dob,
        phone: profileObj.phone,
        address: profileObj.address,
        gender: profileObj.gender,
      },
    }
    res.status(200).json({
      success: true,
      data: data,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    })
  }
}

// Create user
const createUser = async function (req, res) {
  try {
    const { email, password, profileData } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      })
    }

    // Create profile
    const profile = await Profile.create(profileData)

    // Create user
    const user = await User.create({
      email,
      password,
      profileId: profile._id,
    })

    // Generate verification token (expires in 24 hours)
    const verificationToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "24h" }
    )

    try {
      // Send verification email
      await sendVerifyEmail(email, verificationToken)

      // Generate login token (shorter expiration)
      const loginToken = generateToken(user._id)

      res.status(201).json({
        success: true,
        message: "Registration successful! Please check your email to verify your account.",
        data: {
          _id: user._id,
          email: user.email,
          profile,
          token: loginToken,
        },
      })
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError)
      // Still return success but notify about email issue
      res.status(201).json({
        success: true,
        message: "Registration successful, but failed to send verification email. Please try logging in later to resend verification.",
        data: {
          _id: user._id,
          email: user.email,
          profile,
        },
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    })
  }
}

const verifyUser = async function (req, res) {
  const { token } = req.params
  const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret")
  const user = await User.findById(decoded.id)
  user.isVerified = true
  await user.save()
  res.status(200).json({
    success: true,
    message: "User verified successfully",
  })
}

const adminCreateTeacher = async function (req, res) {
  try {
    const { email, password, profileData } = req.body
    const roleId = "682989e63009eb573cbc1444"

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      })
    }

    // Create profile
    const profile = await Profile.create(profileData)

    // Create user
    const user = await User.create({
      email,
      password,
      profileId: profile._id,
      roleId,
    })

    // Generate token
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        profile,
        token,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create teacher",
      error: error.message,
    })
  }
}

// Update user
const updateUser = async (req, res) => {
  try {
    const { email, password, profileData, roleId } = req.body

    // Find user
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    if (!profileData.phone||!profileData.dob||!profileData.gender) {
      return res.status(400).json({
        success: false,
        message: "Phone, dob and gender are required",
      })
    }

    const isUpdatedData = {
      ...profileData,
      isUpdated: true,
    }
    // Update profile if provided
    if (profileData && user.profileId) {
      await Profile.findByIdAndUpdate(user.profileId, isUpdatedData, {
        new: true,
        runValidators: true,
      })
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        email: email || user.email,
        password: password || user.password,
        roleId: roleId || user.roleId,
        updatedAt: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("profileId")
      .populate("roleId")

    res.status(200).json({
      success: true,
      data: updatedUser,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    })
  }
}

// Update user
const updateUserByAdmin = async (req, res) => {
  try {
    const { email, password, profileData, roleId } = req.body

    // Find user
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    if (profileData && user.profileId) {
      await Profile.findByIdAndUpdate(user.profileId, profileData, {
        new: true,
        runValidators: true,
      })
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        email: email || user.email,
        password: password || user.password,
        roleId: roleId || user.roleId,
        updatedAt: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("profileId")
      .populate("roleId")

    res.status(200).json({
      success: true,
      data: updatedUser,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    })
  }
}

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Delete profile
    if (user.profileId) {
      await Profile.findByIdAndDelete(user.profileId)
    }

    // Delete user
    await User.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    })
  }
}

// User login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email }).populate("profileId").populate("roleId", "nameRole")
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(403).json({
        success: false,
        message: "Invalid credentials",
      })
    }
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email address",
      })
    }
    // Generate token
    const token = generateToken(user._id)

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        email: user.email,
        profile: user.profileId,
        role: user.roleId.nameRole,
        token,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    })
  }
}

const sendResetEmail = require("../service/sendResetEmail");

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "your_jwt_secret", {
      expiresIn: "15m"
    });

    await sendResetEmail(email, resetToken);

    res.status(200).json({ success: true, message: "Password reset email sent", resetToken });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to send reset email", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Invalid or expired token", error: error.message });
  }
};
const authProfile = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken.id)
      .populate("profileId", "name dob phone address gender isUpdated imageURL")
      .populate("roleId", "nameRole");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    const data = {
      _id: user._id,
      email: user.email,
      isVerified: user.isVerified,
      role: user.roleId.nameRole,
      profile: user.profileId,
    };

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};
module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  adminCreateTeacher,
  verifyUser,
  forgotPassword,
  resetPassword,
  authProfile,
  updateUserByAdmin,
}
