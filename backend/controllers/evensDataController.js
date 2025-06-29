const EventsData = require("../models/eventsDataModel.js")

const createEventsData = async (req, res) => {
  try {
    const eventsData = await EventsData.create(req.body)
    res.status(201).json({
      success: true,
      data: eventsData,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create events data",
      error: error.message,
    })
  }
}

const getEventsData = async (req, res) => {
  try {
    const eventsData = await EventsData.find()
    res.status(200).json({
      success: true,
      data: eventsData,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch events data",
      error: error.message,
    })
  }
}

const getEventsDataByEventName = async (req, res) => {
  try {
    const eventsData = await EventsData.find({ eventName: req.params.eventName })
    res.status(200).json({
      success: true,
      data: eventsData,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch events data",
      error: error.message,
    })
  }
}

const getEventsDataById = async (req, res) => {
  try {
    const eventsData = await EventsData.findById(req.params.id)
    res.status(200).json({
      success: true,
      data: eventsData,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch events data by id",
      error: error.message,
    })
  }
}
  
const updateEventsData = async (req, res) => {
  try {
    const eventsData = await EventsData.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    res.status(200).json({
      success: true,
      data: eventsData,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update events data",
      error: error.message,
    })
  }
}

const deleteEventsData = async (req, res) => {
  try {
    const eventsData = await EventsData.findByIdAndDelete(req.params.id)
    res.status(200).json({
      success: true,
      message: "Events data deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete events data",
      error: error.message,
    })
  }
}

module.exports = {
  createEventsData,
  getEventsData,
  getEventsDataByEventName,
  getEventsDataById,
  updateEventsData,
  deleteEventsData,
}