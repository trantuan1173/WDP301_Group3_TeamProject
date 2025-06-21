const mongoose = require("mongoose")

const eventsDataSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
    },
    eventTime: {
      type: Date,
      default: Date.now,
    },
    eventData: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true },
)

const EventsData = mongoose.model("EventsData", eventsDataSchema)

module.exports = EventsData
