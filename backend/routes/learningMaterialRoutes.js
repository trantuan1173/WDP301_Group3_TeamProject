const express = require("express");
const router = express.Router();
const { createLearningMaterial, getAllLearningMaterials, getAllLearningMaterialsByCourseId, getAllLearningMaterialsByClassId, getLearningMaterial, deleteLearningMaterial, downloadLearningMaterial, downloadAllMaterialsZip, downloadAllMaterialsZipByCourseId } = require("../controllers/learningMaterialController");
const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../service/multer");

router.post("/", upload.array("file", 10), protect, authorize("admin"), createLearningMaterial);
router.get("/", getAllLearningMaterials);
router.get("/course/:courseId", protect, authorize("admin"), getAllLearningMaterialsByCourseId);
router.get("/class/:classId", protect, getAllLearningMaterialsByClassId);
router.get("/:id", protect, authorize("admin"), getLearningMaterial);
router.delete("/:id", protect, authorize("admin"), deleteLearningMaterial);
router.get("/download/:id", protect, downloadLearningMaterial); 
router.get("/download-zip/:classId", protect, downloadAllMaterialsZip);
router.get("/download-zip/course/:courseId", protect, downloadAllMaterialsZipByCourseId);   

module.exports = router;
