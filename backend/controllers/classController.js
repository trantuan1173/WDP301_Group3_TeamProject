const Class = require("../models/classModel.js");
const CourseDetail = require("../models/courseDetailModel.js");

// Get all classes
const getClasses = async function(req, res) {
  try {
    const classes = await Class.find().populate("teacherId", "email").populate("students", "email").populate("courseId")

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch classes",
      error: error.message,
    })
  }
}

// Get single class
const getClass = async function(req, res) {
  try {
    const classItem = await Class.findById(req.params.id)
      .populate("teacherId", "email")
      .populate("students", "email")
      .populate("courseId")

      const courseId = classItem.courseId?._id?.toString() ?? classItem.courseId?.toString();
      const courseDetails = await CourseDetail.findOne({ courseId: courseId });
  

  
      const formattedClasses = {
          _id: classItem._id,
          teacherId: classItem.teacherId, 
          students: classItem.students, 
          className: classItem.course,
          course: {
            _id: courseId,
            name: classItem.courseId?.nameCourses,
            detail: courseDetails || null,
          },
          progress: classItem.progress,
          note: classItem.note,
          start_time: classItem.start_time,
          end_time: classItem.end_time,
        };
      

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      })
    }

    res.status(200).json({
      success: true,
      data: formattedClasses,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch class",
      error: error.message,
    })
  }
}

// Create class
const createClass = async function(req, res) {
  try {
    const classItem = await Class.create(req.body)

    res.status(201).json({
      success: true,
      data: classItem,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create class",
      error: error.message,
    })
  }
}

// Update class
const updateClass = async (req, res) => {
  try {
    const classItem = await Class.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      {
        new: true,
        runValidators: true,
      },
    )

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      })
    }

    res.status(200).json({
      success: true,
      data: classItem,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update class",
      error: error.message,
    })
  }
}

// Delete class
const deleteClass = async (req, res) => {
  try {
    const classItem = await Class.findByIdAndDelete(req.params.id)

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      })
    }

    res.status(200).json({
      success: true,
      message: "Class deleted successfully",
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete class",
      error: error.message,
    })
  }
}

// Add student to class
const addStudentToClass = async (req, res) => {
  try {
    const { studentId } = req.body

    const classItem = await Class.findById(req.params.id)

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      })
    }

    // Check if student already exists in class
    if (classItem.students.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Student already in class",
      })
    }

    classItem.students.push(studentId)
    await classItem.save()

    res.status(200).json({
      success: true,
      data: classItem,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add student to class",
      error: error.message,
    })
  }
}

// Remove student from class
const removeStudentFromClass = async (req, res) => {
  try {
    const { studentId } = req.body

    const classItem = await Class.findById(req.params.id)

    if (!classItem) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      })
    }

    // Check if student exists in class
    if (!classItem.students.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Student not in class",
      })
    }

    classItem.students = classItem.students.filter((student) => student.toString() !== studentId)
    await classItem.save()

    res.status(200).json({
      success: true,
      data: classItem,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to remove student from class",
      error: error.message,
    })
  }
}

// Get class by student id
// const getClassByStudentId = async (req, res) => {
//   try {
//     const { studentId } = req.params;

//     const classes = await Class.find({ students: studentId })
//       .populate("teacherId", "email")
//       .populate("students", "email")
//       .populate("courseId");

//     res.status(200).json({
//       success: true,
//       count: classes.length,
//       data: classes,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch class",
//       error: error.message,
//     })
//   }
// }

const getClassByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;

    const classes = await Class.find({ students: studentId })
      .populate("teacherId", "email")      
      .populate("students", "email")       
      .populate("courseId");               

    const courseIdList = classes.map((cls) => cls.courseId?._id?.toString() ?? cls.courseId?.toString());
    const courseDetails = await CourseDetail.find({ courseId: { $in: courseIdList } });

    const courseDetailMap = {};
    courseDetails.forEach(detail => {
      courseDetailMap[detail.courseId.toString()] = detail;
    });

    const formattedClasses = classes.map((cls) => {
      const courseIdStr = cls.courseId?._id?.toString() ?? cls.courseId?.toString();
      const courseDetail = courseDetailMap[courseIdStr];

      return {
        _id: cls._id,
        teacher: cls.teacherId, 
        students: cls.students, 
        className: cls.className,
        course: {
          _id: courseIdStr,
          name: cls.courseId?.nameCourses,
          detail: courseDetail || null,
        },
        progress: cls.progress,
        note: cls.note,
        start_time: cls.start_time,
        end_time: cls.end_time,
      };
    });

    res.status(200).json({
      success: true,
      count: formattedClasses.length,
      data: formattedClasses,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch class",
      error: error.message,
    });
  }
};

// Get class by teacher id
const getClassByTeacherId = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const classes = await Class.find({ teacherId })
      .populate("courseId");

      const formattedClasses = classes.map((cls) => ({
        _id: cls._id,
        teacherId: cls.teacherId?._id?.toString() ?? cls.teacherId?.toString(),
        courseId: cls.courseId?._id?.toString() ?? cls.courseId?.toString(),
        className: cls.className,
        progress: cls.progress,
        note: cls.note,
        start_time: cls.start_time,
        end_time: cls.end_time,
      }));
    res.status(200).json({
      success: true,
      count: classes.length,
      data:  formattedClasses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch class",
      error: error.message,
    })
  }
}

module.exports = {
  getClasses,
  getClass,
  createClass,
  updateClass,
  deleteClass,
  addStudentToClass,
  removeStudentFromClass,
  getClassByStudentId,
  getClassByTeacherId,
}

