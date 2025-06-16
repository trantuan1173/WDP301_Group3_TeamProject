import React from 'react'


import AdminDashboard from './pages/Dashboard/AdminDashboard'
import Register from './pages/Auth/Register'
import Login from './pages/Auth/Login'
import VerifyPage from './pages/Auth/VerifyPage'
import { Routes, Route } from 'react-router-dom'

import AdminDetailCourse from './components/Admin/ManagerCourse/AdminDetailCourse'
import GuestView from './pages/GuestView'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'
import UserDashboard from './pages/Dashboard/UserDashboard'
import UserProfileForm from './components/Student/UserProfileForm'
import RequireAuth from './context/RequireAuth'
import { AuthProvider } from './context/AuthContext'
import ViewCourseDetails from './pages/ViewCourseDetails'
import TeacherDashboard from './pages/Dashboard/TeacherDasboard'
import AdminViewClassDetails from './components/Admin/ManagerClass/AdminViewClassDetails'
import AdminViewSchedule from './components/Admin/ManagerClass/AdminViewShedule'
import AttendanceForm from './components/Teacher/AttendanceForm'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import VNPay from './pages/vnPay';
import PaymentResult from './pages/PaymentResult';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/course/:id" element={<AdminDetailCourse />} />
        <Route path="/admin/class/:classId/schedule" element={<AdminViewSchedule />} />

        <Route path="/admin/class/:classId" element={<AdminViewClassDetails />} />
        <Route element={<RequireAuth allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={["student", "teacher", "admin"]} />}>
          <Route path="/update-profile" element={<UserDashboard selectedPage="profile" />} />
          <Route path="/user" element={<UserDashboard />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={["teacher"]} />}>
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/attendance/:classId" element={<AttendanceForm />} />
        </Route>

        <Route path="/verify/:token" element={<VerifyPage />} />
        <Route path="/" element={<GuestView />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/vnPay" element={<VNPay />} />
        <Route path="/vnpay_return" element={<PaymentResult />} />
        <Route path="/course/:courseId" element={<ViewCourseDetails />} />
       
          
        
      </Routes>
    </AuthProvider>
  )
}

export default App;