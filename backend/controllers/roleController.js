const Role = require("../models/roleModel.js")

// Get all roles
const getRoles = async (req, res) => {
  try {
    const roles = await Role.find()

    res.status(200).json({
      success: true,
      count: roles.length,
      data: roles,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch roles",
      error: error.message,
    })
  }
}

// Get single role
const getRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id)

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      })
    }

    res.status(200).json({
      success: true,
      data: role,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch role",
      error: error.message,
    })
  }
}

// Create role
const createRole = async (req, res) => {
  try {
    const role = await Role.create(req.body)

    res.status(201).json({
      success: true,
      data: role,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create role",
      error: error.message,
    })
  }
}

// Update role
const updateRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      })
    }

    res.status(200).json({
      success: true,
      data: role,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update role",
      error: error.message,
    })
  }
}

// Delete role
const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id)

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete role",
      error: error.message,
    })
  }
}

module.exports={
    getRoles,
    getRole,
    createRole,
    updateRole,
    deleteRole
}
    