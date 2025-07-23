const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const courseName = req.body.courseName || "default";
    const safeFolder = courseName.replace(/[^\w\s-]/gi, "_");
    const uploadPath = path.join(__dirname, "..", "uploads", safeFolder);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const original = file.originalname;
    cb(null, uniqueSuffix + "-" + original);
  },
});

const upload = multer({ storage });

module.exports = upload;