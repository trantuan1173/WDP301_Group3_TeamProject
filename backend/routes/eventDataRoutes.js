const express = require("express")
const router = express.Router()

const { createEventsData, getEventsData, getEventsDataByEventName, getEventsDataById, updateEventsData, deleteEventsData } = require("../controllers/evensDataController")

router.post("/", createEventsData)
router.get("/", getEventsData)
router.get("/event/:eventName", getEventsDataByEventName)
router.get("/:id", getEventsDataById)
router.put("/:id", updateEventsData)
router.delete("/:id", deleteEventsData)

module.exports = router
