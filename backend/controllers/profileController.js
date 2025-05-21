const Profile = require("../models/profileModel.js")

// Get all profiles
const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find()

    res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profiles",
      error: error.message,
    })
  }
}

// Get single profile
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id)

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      })
    }

    res.status(200).json({
      success: true,
      data: profile,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    })
  }
}

// Create profile
const createProfile = async (req, res) => {
  try {
    const profile = await Profile.create(req.body)

    res.status(201).json({
      success: true,
      data: profile,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create profile",
      error: error.message,
    })
  }
}

// Update profile
const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      {
        new: true,
        runValidators: true,
      },
    )

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      })
    }

    res.status(200).json({
      success: true,
      data: profile,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    })
  }
}

// Delete profile
const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findByIdAndDelete(req.params.id)

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete profile",
      error: error.message,
    })
  }
}

module.exports={
    getProfiles,
    getProfile,
    createProfile,
    updateProfile,
    deleteProfile
}
