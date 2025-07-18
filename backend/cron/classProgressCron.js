const cron = require("node-cron");
const Class = require("../models/classModel");
const { updateClassProgress } = require("../controllers/classController");

// Chạy mỗi tiếng (phút 0)
cron.schedule("0 * * * *", async () => {
  try {
    const allClasses = await Class.find({});
    await Promise.all(allClasses.map(cls => updateClassProgress(cls._id)));
    console.log("Updated all class progress at", new Date());
  } catch (err) {
    console.error("Error updating class progress:", err);
  }
});