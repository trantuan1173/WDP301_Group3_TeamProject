const TestAssign = require("../models/testAssignModel.js")
const Test = require("../models/testModel.js")
const Class = require("../models/classModel.js")
const Course = require("../models/courseModel.js")
const TestSubmission = require("../models/testSubmissionModel.js")

// Get all test assignments
const getTestAssigns = async (req, res) => {
  try {
    const testAssigns = await TestAssign.find()
      .populate("courseId")
      .populate("testId")
      .populate("classId")
      .populate("teacherId", "email");

    res.status(200).json({
      success: true,
      count: testAssigns.length,
      data: testAssigns,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch test assignments",
      error: error.message,
    });
  }
};

// Get test assignments by class
const getTestAssignsByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    const testAssigns = await TestAssign.find({ classId })
      .populate("courseId")
      .populate("testId")
      .populate("teacherId", "email");

    res.status(200).json({
      success: true,
      count: testAssigns.length,
      data: testAssigns,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch test assignments",
      error: error.message,
    });
  }
};

// Get test assignments by course
const getTestAssignsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const testAssigns = await TestAssign.find({ courseId })
      .populate("testId")
      .populate("classId")
      .populate("teacherId", "email");

    res.status(200).json({
      success: true,
      count: testAssigns.length,
      data: testAssigns,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch test assignments",
      error: error.message,
    });
  }
};

// Get test assignments by student
const getTestAssignsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params
    // Tìm tất cả lớp mà học sinh này đang học
    const classItem = await Class.find({ students: studentId });

    // Nếu không có lớp nào
    if (!classItem.length) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in any class",
      });
    }

    // Lấy danh sách classId
    const classIds = classItem.map(cls => cls._id);

    // Tìm tất cả bài kiểm tra đã gán cho các lớp đó
    const testAssigns = await TestAssign.find({ classId: { $in: classIds } })
      .populate("courseId")
      .populate("testId")
      .populate([
        {
          path: "teacherId", 
          select: "profileId",
          populate: {
            path: "profileId",
            select: "name"
          }
        }
      ]);

    // Tìm tất cả bài đã nộp của học sinh này
    const submissions = await TestSubmission.find({
      studentId,
      testAssignId: { $in: testAssigns.map(t => t._id) }
    });

    // Gắn điểm vào mỗi bài kiểm tra
    const resultWithScore = testAssigns.map(assign => {
      const submission = submissions.find(sub => sub.testAssignId.toString() === assign._id.toString());

      const isExpired = new Date(assign.dueDate) < new Date();
      return {
        ...assign.toObject(),
        submitted: !!submission,
        score: submission?.score || null,
        submittedAt: submission?.submittedAt || null,
        isExpired,
      };
    });
    
    res.status(200).json({
      success: true,
      count: testAssigns.length,
      data: resultWithScore,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch test assignments",
      error: error.message,
    });
  }
};

// Get single test assignment
const getTestAssign = async (req, res) => {
  try {
    const testAssign = await TestAssign.findById(req.params.id)
      .populate("courseId")
      .populate("testId")
      .populate("classId")
      .populate("teacherId", "email");

    if (!testAssign) {
      return res.status(404).json({
        success: false,
        message: "Test assignment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: testAssign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch test assignment",
      error: error.message,
    });
  }
};

// Create test assignment
const createTestAssign = async (req, res) => {
  try {
    const { courseId, testId, classId, title, teacherId, startDate, dueDate } =
      req.body;

    // Validate references
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    const classItem = await Class.findById(classId);
    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    // Check if test assignment already exists for this test and class
    const existingAssignment = await TestAssign.findOne({ testId, classId });
    if (existingAssignment) {
      return res.status(400).json({
        success: false,
        message: "Test already assigned to this class",
      });
    }

    const testAssign = await TestAssign.create({
      courseId,
      testId,
      classId,
      title,
      teacherId,
      startDate,
      dueDate,
    });

    res.status(201).json({
      success: true,
      data: testAssign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create test assignment",
      error: error.message,
    });
  }
};

// Update test assignment
const updateTestAssign = async (req, res) => {
  try {
    const testAssign = await TestAssign.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!testAssign) {
      return res.status(404).json({
        success: false,
        message: "Test assignment not found",
      });
    }

    res.status(200).json({
      success: true,
      data: testAssign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update test assignment",
      error: error.message,
    });
  }
};

// Delete test assignment
const deleteTestAssign = async (req, res) => {
  try {
    const testAssign = await TestAssign.findByIdAndDelete(req.params.id);

    if (!testAssign) {
      return res.status(404).json({
        success: false,
        message: "Test assignment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Test assignment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete test assignment",
      error: error.message,
    });
  }
};

// Get single test assignment for a student and testId
const getTestAssignsForStudent = async (req, res) => {
  try {
    const { studentId, testId } = req.params;
    
    // Find all classes the student is in
    const classes = await Class.find({ students: studentId });

    if (!classes.length) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in any class",
      });
    }

    const classIds = classes.map(cls => cls._id);

    // Find the test assignment matching the testId and any of those classes
    const assignment = await TestAssign.findOne({
      testId,
      classId: { $in: classIds },
    })
      .populate("courseId")
      .populate("testId")
      .populate("teacherId", "email")
      .populate("classId");

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Test assignment not found for this student",
      });
    }


    res.status(200).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch test assignment for student",
      error: error.message,
    });
  }
};


module.exports = {
  getTestAssigns,
  getTestAssignsByClass,
  getTestAssignsByCourse,
  getTestAssign,
  createTestAssign,
  updateTestAssign,
  deleteTestAssign,
  getTestAssignsByStudent,
  getTestAssignsForStudent
}   
