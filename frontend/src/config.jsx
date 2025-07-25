// API Configuration
// const baseUrl = 'https://beenglishcenter.gicunhco.com';
const baseUrl = 'http://localhost:9999';

export const API_ENDPOINTS = {
  AUTH_PROFILE: `${baseUrl}/api/users/authProfile`,
  //Protected endpoints
  GET_PROFILE_BY_USERID: (userId) => `${baseUrl}/api/users/${userId}`,
  USER_UPDATE_PROFILE: (userId) => `${baseUrl}/api/users/${userId}`,
  GET_ALL_ROLE: `${baseUrl}/api/roles`,
  // Auth endpoints
  LOGIN: `${baseUrl}/api/users/login`,
  REGISTER: `${baseUrl}/api/users/register`,
  GET_ALL_ACCOUNT: `${baseUrl}/api/users`,
  GET_ALL_COURSE: `${baseUrl}/api/courses`,
  REGISTER_TEACHER: `${baseUrl}/api/users/createTeacher`,
  ADMIN_UPDATE_USER: `${baseUrl}/api/users/updateByAdmin/:userId`,
  DELETE_USER: `${baseUrl}/api/users/:userId`,
  //Admin endpoints
  CREATE_COURSE: `${baseUrl}/api/courses`,
  CREATE_COURSE_DETAIL: `${baseUrl}/api/courseDetail`,
  GET_ALL_COURSE_DETAIL: `${baseUrl}/api/courseDetail`,
  UPDATE_COURSE: `${baseUrl}/api/courses/:courseId`,
  // GET_COURSE_BY_ID: (courseId) => `${baseUrl}/api/courses/${courseId}`,
  UPDATE_COURSE_DETAIL: `${baseUrl}/api/courseDetail/:courseDetailId`,
  DELETE_COURSE: `${baseUrl}/api/courses/:courseId`,

  GET_ALL_CLASSES: `${baseUrl}/api/classes`,
  GET_CLASS_BY_ID: (classId) => `${baseUrl}/api/classes/${classId}`,
  CREATE_CLASS: `${baseUrl}/api/classes`,
  UPDATE_CLASS: (classId) => `${baseUrl}/api/classes/${classId}`,
  GET_CLASSES_BY_COURSE_ID: (courseId) => `${baseUrl}/api/classes/course/${courseId}`,
  GET_ALL_TEACHER: `${baseUrl}/api/users/allTeacher`,
  REMOVE_STUDENT_CLASS: (classId) => `${baseUrl}/api/classes/${classId}/students`,
  CREATE_SCHEDULE: `${baseUrl}/api/schedule`,
  GET_ALL_SCHEDULE: `${baseUrl}/api/schedule`,
  GET_SHEDULE_BY_CLASSID: (classId) => `${baseUrl}/api/schedule/class/${classId}`,

  UPDATE_SCHEDULE: (scheduleId) => `${baseUrl}/api/schedule/${scheduleId}`,
  DELETE_SHEDULE_BY_CLASSID: (classId) =>`${baseUrl}/api/schedule/class/${classId}`,
  CREATE_BULK_SCHEDULE: `${baseUrl}/api/schedule/bulk`,

  GET_ALL_FEEDBACK_TEACHER: `${baseUrl}/api/feedbacksTeacher`,
  GET_ALL_FEEDBACK_COURSE: `${baseUrl}/api/feedbacksCourse`,
  GET_ALL_PAYMENT: `${baseUrl}/api/payments`,
  ADD_STUDENT_INTO_CLASS: (classId) => `${baseUrl}/api/classes/${classId}/students`,
  GET_EROLLED_STUDENTS_BY_COURSE_ID: (courseId) => `${baseUrl}/api/enrollments/course/${courseId}`,
  UPDATE_EROLLED_STATUS: (enrollmentId) => `${baseUrl}/api/enrollments/${enrollmentId}/status`,
  GET_ALL_ENROLLMENTS: `${baseUrl}/api/enrollments`,
  GET_ENROLLMENT_BY_ID: (enrollmentId) => `${baseUrl}/api/enrollments/${enrollmentId}`,
  GET_AVAILABLE_TEACHERS: (classId) => `${baseUrl}/api/classes/${classId}/available-teachers`,

  // Student endpoints
  FORGOT_PASSWORD: `${baseUrl}/api/users/forgot-password`,
  RESET_PASSWORD: `${baseUrl}/api/users/reset-password`,
  GET_STUDENT_SCHEDULE: (userId) => `${baseUrl}/api/schedule/student/${userId}`,
  GET_COURSE: (courseId) => `${baseUrl}/api/courses/${courseId}`,
  STUDENT_SUBMIT_TEST: `${baseUrl}/api/testSubmission/submit`,
  GET_STUDENT_EROLLMENT: (studentId) => `${baseUrl}/api/enrollments/student/${studentId}`,

  GET_TESTS_BY_STUDENT_ID: (studentId) => `${baseUrl}/api/test-assigns/student/${studentId}`,
  GET_ASSIGNED_TESTS_FOR_STUDENT: (studentId, testId) => `${baseUrl}/api/test-assigns/student/${studentId}/test/${testId}`,
  CHANGE_PASSWORD: `${baseUrl}/api/users/change-password`,

  // Teacher endpoints
  GET_TEACHER_SCHEDULE: (userId) => `${baseUrl}/api/schedule/teacher/${userId}`,
  GET_CLASS_BY_TEACHERID: (teacherId) =>
    `${baseUrl}/api/classes/teacher/${teacherId}`,

  TEACHER_CREATE_TEST: `${baseUrl}/api/tests`,
  TEACHER_GET_TESTS: `${baseUrl}/api/tests`,
  GET_TEST_BY_CLASS: (classId) => `${baseUrl}/api/tests/class/${classId}`,
  GET_TEST_BY_ID: (testId) => `${baseUrl}/api/tests/${testId}`,
  GET_TEST_ASSIGN_BY_CLASS: (classId) =>
    `${baseUrl}/api/test-assigns/class/${classId}`,
  CREATE_TEST_ASSIGN: `${baseUrl}/api/test-assigns`,

  GET_ATTENDANCES_BY_CLASS: (classId, date) =>
    `${baseUrl}/api/attendance/class/${classId}?date=${date}`,

  CREATE_ATTENDANCE: `${baseUrl}/api/attendance`,


  GET_TEST_QUESTION_BY_ID: (testId) => `${baseUrl}/api/tests/${testId}`,

  GET_ASSIGNED_TESTS_BY_TEACHER: `${baseUrl}/api/test-assigns/get-test-assigns-by-teacher`,
  GET_SUBMISSIONS_BY_TEST_ASSIGN: (testAssignId) => `${baseUrl}/api/testSubmission/scores-by-test-assign/${testAssignId}`,
  GET_FEEDBACK_TEACHER_BY_CLASS: (classId) => `${baseUrl}/api/feedbacksTeacher/class/${classId}`,
  //Guest endpoints
  GET_HIGHLIGHT_FEEDBACKS: `${baseUrl}/api/feedbacksCourse/highlight`,
  GET_HIGHLIGHT_TEACHER_FEEDBACKS: `${baseUrl}/api/feedbacksTeacher/highlight`,
  GET_FEEDBACKS_COURSE: (courseId) => `${baseUrl}/api/feedbacksCourse/highlight/${courseId}`,

  GET_COURSES: `${baseUrl}/api/courseDetail`,
  GET_COURSE_BY_ID: (courseId) => `${baseUrl}/api/courseDetail/course/${courseId}`,

  REGISTER_VERIFY_EMAIL: (token) => `${baseUrl}/api/users/verify/${token}`,
  RESEND_VERIFY_EMAIL: `${baseUrl}/api/users/resend-verify-email`,

  PAYMENT_CREATE_PAYMENT_URL: `${baseUrl}/api/payments/create_payment_url`,
  GUEST_VIEW_OPENDAY_SCHEDULE: `${baseUrl}/api/classes/open-day-schedule`,
  //student endpoints
  GET_CLASSES_BY_STUDENT_ID: (studentId) => `${baseUrl}/api/classes/student/${studentId}`,
  // GET_CLASS_BY_ID: (id) => `${baseUrl}/api/classes/${id}`,
  // Attendance
  GET_ATTENDANCE_BY_STUDENT_ID: (studentId) =>
    `${baseUrl}/api/attendance/student/${studentId}`,
  FEEDBACK_TEACHER: `${baseUrl}/api/feedbacksTeacher`, 
  FEEDBACK_COURSE: `${baseUrl}/api/feedbacksCourse`,
  // Test
  DOWNLOAD_XLSX_TEMPLATE: `${baseUrl}/api/tests/download-xlsx-template`,
  UPLOAD_TEST_FROM_XLSX: `${baseUrl}/api/tests/upload-xlsx`,
  CREATE_TEST_FROM_AI: `${baseUrl}/api/tests/create-from-ai`,

  //Statistics
  GET_STATISTICS_EVENT: (eventName) => `${baseUrl}/api/eventsData/event/${eventName}`,

  //Learning Material
  CREATE_LEARNING_MATERIAL: `${baseUrl}/api/learningMaterials`,
  GET_ALL_LEARNING_MATERIALS_BY_COURSE_ID: (courseId) => `${baseUrl}/api/learningMaterials/course/${courseId}`,
  GET_ALL_LEARNING_MATERIALS_BY_CLASS_ID: (classId) => `${baseUrl}/api/learningMaterials/class/${classId}`,
  GET_LEARNING_MATERIAL_BY_ID: (id) => `${baseUrl}/api/learningMaterials/${id}`,
  DOWNLOAD_LEARNING_MATERIAL: (id) => `${baseUrl}/api/learningMaterials/download/${id}`,
  DELETE_LEARNING_MATERIAL: (id) => `${baseUrl}/api/learningMaterials/${id}`,
  DOWNLOAD_ALL_MATERIALS_ZIP: (classId) => `${baseUrl}/api/learningMaterials/download-zip/${classId}`,
  DOWNLOAD_ALL_MATERIALS_BY_COURSE_ID: (courseId) => `${baseUrl}/api/learningMaterials/download-zip/course/${courseId}`,

  //Customer Consulting
  CREATE_CUSTOMER_CONSULTING: `${baseUrl}/api/customerConsultings`,
  GET_ALL_CUSTOMER_CONSULTING: `${baseUrl}/api/customerConsultings`,
  EDIT_CUSTOMER_CONSULTING: (consultingId) => `${baseUrl}/api/customerConsultings/${consultingId}`,
  DELETE_CUSTOMER_CONSULTING: (consultingId) => `${baseUrl}/api/customerConsultings/${consultingId}`,
};