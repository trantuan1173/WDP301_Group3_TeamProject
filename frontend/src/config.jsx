// API Configuration
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

  FORGOT_PASSWORD: `${baseUrl}/api/users/forgot-password`,
  RESET_PASSWORD: `${baseUrl}/api/users/reset-password`,

  //Guest endpoints
  GET_COURSES: `${baseUrl}/api/courseDetail/forguest`,

};