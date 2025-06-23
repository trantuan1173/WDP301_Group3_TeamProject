const Test = require("../models/testModel.js");
const TestSubmission = require("../models/testSubmissionModel.js");
const path = require("path")
const XLSX = require("xlsx")
const fs = require("fs")

// Get all tests
const getTests = async function(req, res) {
  try {
    const tests = await Test.find().populate("courseId").populate("classId").populate("teacherId")

    res.status(200).json({
      success: true,
      count: tests.length,
      data: tests,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tests",
      error: error.message,
    })
  }
}

// Get tests by class
const getTestsByClass = async function(req, res) {
  try {
    const { classId } = req.params

    const tests = await Test.find({ classId }).populate("courseId").populate("teacherId")

    res.status(200).json({
      success: true,
      count: tests.length,
      data: tests,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tests",
      error: error.message,
    })
  }
}

// Get single test
const getTest = async function(req, res) {
  try {
    const test = await Test.findById(req.params.id).populate("courseId").populate("classId").populate("teacherId")

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      })
    }

    res.status(200).json({
      success: true,
      data: test,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch test",
      error: error.message,
    })
  }
}

// Get tests by course
const getTestsByCourse = async function(req, res) {
  try {
    const { courseId } = req.params

    const tests = await Test.find({ courseId }).populate("teacherId")

    res.status(200).json({
      success: true,
      count: tests.length,
      data: tests,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tests",
      error: error.message,
    })
  }
}

// Create test
const createTest = async (req, res) => {
  try {
    const test = await Test.create(req.body)

    res.status(201).json({
      success: true,
      data: test,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create test",
      error: error.message,
    })
  }
}

// Update test
const updateTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      })
    }

    res.status(200).json({
      success: true,
      data: test,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update test",
      error: error.message,
    })
  }
}

// Delete test
const deleteTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id)

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      })
    }

    // Delete all submissions for this test
    await TestSubmission.deleteMany({ testId: req.params.id })

    res.status(200).json({
      success: true,
      message: "Test and all submissions deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete test",
      error: error.message,
    })
  }
}

// Submit test
const submitTest = async (req, res) => {
  try {
    const { testId, studentId, answers } = req.body

    // Check if test exists
    const test = await Test.findById(testId)
    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      })
    }

    // Check if submission already exists
    const existingSubmission = await TestSubmission.findOne({
      testId,
      studentId,
    })

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted this test",
      })
    }

    // Calculate score
    let score = 0
    answers.forEach((answer, index) => {
      if (
        test.questions[answer.questionIndex] &&
        answer.answer === test.questions[answer.questionIndex].correctAnswer
      ) {
        score++
      }
    })

    // Calculate percentage
    const percentage = (score / test.questions.length) * 100

    // Create submission
    const submission = await TestSubmission.create({
      testId,
      studentId,
      answers,
      score: percentage,
      submittedAt: Date.now(),
    })

    res.status(201).json({
      success: true,
      data: submission,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit test",
      error: error.message,
    })
  }
}

// Get test submissions
const getTestSubmissions = async (req, res) => {
  try {
    const { testId } = req.params

    const submissions = await TestSubmission.find({ testId }).populate("studentId")

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch test submissions",
      error: error.message,
    })
  }
}

// Get student test submissions
const getStudentSubmissions = async (req, res) => {
  try {
    const { studentId } = req.params

    const submissions = await TestSubmission.find({ studentId }).populate("testId")

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch student submissions",
      error: error.message,
    })
  }
}

// Download XLSX template
const downloadXLSXTemplate = (req, res) => {
  const filePath = path.join(__dirname, "../service/templates/test-template.xlsx")
  res.download(filePath, "test-template.xlsx")
}

// Upload test from XLSX
// const uploadTestFromXLSX = async (req, res) => {
//   try {
//     const filePath = req.file.path
//     const workbook = XLSX.readFile(filePath)
//     const sheetName = workbook.SheetNames[0]
//     const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])

//     const questions = data.map((row) => ({
//       question: row.question,
//       options: [row.option1, row.option2, row.option3, row.option4],
//       correctAnswer: row.correctAnswer,
//     }))

//     const { courseId, classId, teacherId, title, description } = req.body

//     const test = await Test.create({
//       courseId,
//       classId,
//       teacherId,
//       title,
//       description,
//       questions,
//     })

//     fs.unlinkSync(filePath)

//     res.status(201).json({ success: true, data: test })
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Upload failed", error: error.message })
//   }
// }

const uploadTestFromXLSX = async (req, res) => {
  try {
    const filePath = req.file.path;

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);


    const questions = data.map((row) => ({
      question: row.question,
      options: [row.option1, row.option2, row.option3, row.option4],
      correctAnswer: row.correctAnswer,
    }));

    const { courseId, teacherId, title, description } = req.body;

    const test = await Test.create({
      courseId,
      // classId,
      teacherId,
      title,
      description,
      questions,
    });

    res.status(201).json({ success: true, data: test });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ success: false, message: "Upload failed", error: error.message });
  }
};

const { generateTestWithAI } = require("../service/aiGenerator.js");

const createTestFromAI = async (req, res) => {
  try {
    const { title, description, promptText, courseId, teacherId } = req.body;

    const questions = await generateTestWithAI(promptText);

    const test = await Test.create({
      title,
      description,
      courseId,
      // classId,
      teacherId,
      questions,
    });

    res.status(201).json({ success: true, data: test });
  } catch (error) {
    console.error("Lỗi tạo đề bằng AI:", error);
    res.status(500).json({ success: false, message: "Tạo đề bằng AI thất bại", error: error.message });
  }
};

module.exports = {
  getTests,
  getTestsByClass,
  getTest,
  getTestsByCourse,
  createTest,
  updateTest,
  deleteTest,
  submitTest,
  getTestSubmissions,
  getStudentSubmissions,
  downloadXLSXTemplate,
  uploadTestFromXLSX,
  createTestFromAI,
}
