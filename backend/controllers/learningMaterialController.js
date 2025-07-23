const LearningMaterial = require("../models/learningMaterialModel");
const Class = require("../models/classModel");
const Course = require("../models/courseModel");
const path = require("path");
const fs = require("fs");
const archiver = require("archiver");

// Create a new learning material
const createLearningMaterial = async (req, res) => {
    try {
        const { courseId, fileType, uploadedBy } = req.body;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }
        // const title = req.file.originalname;
        // const safeCourseName = course.nameCourses.replace(/[^\w\s-]/gi, "_");
        // const fileUrl = `/uploads/${safeCourseName}/${req.file.filename}`;
        // const file = req.files[0];
        // const title = file.originalname;
        // const safeCourseName = course.nameCourses.replace(/[^\w\s-]/gi, "_");
        // const fileUrl = `/uploads/${safeCourseName}/${file.filename}`;

        // if (!file) {
        //     return res.status(400).json({ error: "No file uploaded" });
        // }

        // const learningMaterial = new LearningMaterial({
        //     courseId,
        //     title,
        //     fileUrl,
        //     fileType,
        //     uploadedBy,
        // });
        // await learningMaterial.save();
        // res.status(201).json({ learningMaterial });
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        const safeCourseName = course.nameCourses.replace(/[^\w\s-]/gi, "_");

        const savedMaterials = [];

        for (const file of req.files) {
            const title = file.originalname;
            const fileUrl = `/uploads/${safeCourseName}/${file.filename}`;

            const learningMaterial = new LearningMaterial({
                courseId,
                title,
                fileUrl,
                fileType,
                uploadedBy,
            });

            const saved = await learningMaterial.save();
            savedMaterials.push(saved);
        }

        res.status(201).json({ learningMaterials: savedMaterials });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create learning material" });
    }
};

// Get all learning materials
const getAllLearningMaterials = async (req, res) => {
    try {
        const learningMaterials = await LearningMaterial.find();
        res.status(200).json({ learningMaterials });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch learning materials" });
    }
};

// Get all learning materials by courseId
const getAllLearningMaterialsByCourseId = async (req, res) => {
    try {
        const { courseId } = req.params;
        const learningMaterials = await LearningMaterial.find({ courseId });
        res.status(200).json({ learningMaterials });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch learning materials by courseId" });
    }
};

// Get all learning materials by classId
const getAllLearningMaterialsByClassId = async (req, res) => {
    try {
        const { classId } = req.params;
        const classItem = await Class.findById(classId);
        const courseId = classItem.courseId.toString();
        const learningMaterials = await LearningMaterial.find({ courseId });
        res.status(200).json({ learningMaterials });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch learning materials by classId" });
    }
};

// Get single learning material
const getLearningMaterial = async (req, res) => {
    try {
        const learningMaterial = await LearningMaterial.findById(req.params.id);
        res.status(200).json({ learningMaterial });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch learning material" });
    }
};

// Delete learning material
const deleteLearningMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        await LearningMaterial.findByIdAndDelete(id);
        res.status(200).json({ message: "Learning material deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete learning material" });
    }
};

// Download learning material
const downloadLearningMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const learningMaterial = await LearningMaterial.findById(id);
        if (!learningMaterial) {
            return res.status(404).json({ error: "Learning material not found" });
        }
        const filePath = path.join(__dirname, "..", learningMaterial.fileUrl);
        res.download(filePath, learningMaterial.title);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to download learning material" });
    }
};

// Download all learning materials
const downloadAllMaterialsZip = async (req, res) => {
    try {
        const classItem = await Class.findById(req.params.classId);
        const courseId = classItem.courseId.toString();
        const materials = await LearningMaterial.find({ courseId });

        if (!materials.length) {
            return res.status(404).json({ message: "No materials found" });
        }

        const zipFilename = `course_${courseId}_materials.zip`;
        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", `attachment; filename=${zipFilename}`);

        const archive = archiver("zip", { zlib: { level: 9 } });
        archive.on("error", err => {
            throw err;
        });
        archive.pipe(res);

        for (const material of materials) {
            const filePath = path.join(__dirname, "..", material.fileUrl);
            const fileName = path.basename(filePath);
            if (fs.existsSync(filePath)) {
                archive.file(filePath, { name: fileName });
            }
        }

        archive.finalize();
    } catch (err) {
        console.error("Error generating zip:", err);
        res.status(500).json({ message: "Failed to generate ZIP", error: err.message });
    }
};

const downloadAllMaterialsZipByCourseId = async (req, res) => {
    try {

        const courseId = req.params.courseId;
        const materials = await LearningMaterial.find({ courseId });

        if (!materials.length) {
            return res.status(404).json({ message: "No materials found" });
        }

        const zipFilename = `course_${courseId}_materials.zip`;
        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", `attachment; filename=${zipFilename}`);

        const archive = archiver("zip", { zlib: { level: 9 } });
        archive.on("error", err => {
            throw err;
        });
        archive.pipe(res);

        for (const material of materials) {
            const filePath = path.join(__dirname, "..", material.fileUrl);
            const fileName = path.basename(filePath);
            if (fs.existsSync(filePath)) {
                archive.file(filePath, { name: fileName });
            }
        }

        archive.finalize();
    } catch (err) {
        console.error("Error generating zip:", err);
        res.status(500).json({ message: "Failed to generate ZIP", error: err.message });
    }
};

module.exports = {
    createLearningMaterial,
    getAllLearningMaterials,
    getAllLearningMaterialsByCourseId,
    getAllLearningMaterialsByClassId,
    getLearningMaterial,
    deleteLearningMaterial,
    downloadLearningMaterial,
    downloadAllMaterialsZip,
    downloadAllMaterialsZipByCourseId,
};
