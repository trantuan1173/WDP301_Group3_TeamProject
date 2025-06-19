// API Configuration
//const baseUrl = 'https://beenglishcenter.davidmusic.site/';
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
  UPDATE_COURSE_DETAIL: `${baseUrl}/api/courseDetail/:courseDetailId`,
  DELETE_COURSE: `${baseUrl}/api/courses/:courseId`,

  

  GET_ALL_CLASSES: `${baseUrl}/api/classes`,
  GET_CLASS_BY_ID: (classId) => `${baseUrl}/api/classes/${classId}`,
  CREATE_CLASS: `${baseUrl}/api/classes`,
  GET_ALL_TEACHER: `${baseUrl}/api/users/allTeacher`,
  UPDATE_CLASS: (classId) => `${baseUrl}/api/classes/${classId}`,
  CREATE_SCHEDULE: `${baseUrl}/api/schedule`,
  GET_SHEDULE_BY_CLASSID: (classId) => `${baseUrl}/api/schedule/class/${classId}`,
  UPDATE_SCHEDULE: (scheduleId) => `${baseUrl}/api/schedule/${scheduleId}`,
  DELETE_SHEDULE_BY_CLASSID: (classId) => `${baseUrl}/api/schedule/class/${classId}`,

  GET_ALL_STUDENT_FEEDBACK: `${baseUrl}/api/feedbacks`,

// Student endpoints
  FORGOT_PASSWORD: `${baseUrl}/api/users/forgot-password`,
  RESET_PASSWORD: `${baseUrl}/api/users/reset-password`,
  GET_STUDENT_SCHEDULE: (userId) => `${baseUrl}/api/schedule/student/${userId}`,
// Teacher endpoints
  GET_TEACHER_SCHEDULE: (userId) => `${baseUrl}/api/schedule/teacher/${userId}`,
  GET_ATTENDANCES_BY_CLASS: (classId) => `${baseUrl}/api/attendance/class/${classId}`,
  CREATE_ATTENDANCE: `${baseUrl}/api/attendance`,

  TEACHER_CREATE_TEST: `${baseUrl}/api/tests`,
  TEACHER_GET_TESTS: `${baseUrl}/api/tests`,
  //Guest endpoints
  GET_COURSES: `${baseUrl}/api/courseDetail`,
  GET_COURSE_BY_ID: (courseId) => `${baseUrl}/api/courseDetail/course/${courseId}`,

  REGISTER_VERIFY_EMAIL: (token) => `${baseUrl}/api/users/verify/${token}`,
  RESEND_VERIFY_EMAIL: `${baseUrl}/api/users/resend-verify-email`,

};