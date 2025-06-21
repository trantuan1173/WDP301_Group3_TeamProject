import React from 'react'


import AdminDashboard from './pages/Dashboard/AdminDashboard'
import Register from './pages/Auth/Register'
import Login from './pages/Auth/Login'
import VerifyPage from './pages/Auth/VerifyPage'
import { Routes, Route, Navigate } from 'react-router-dom'

import AdminDetailCourse from './components/Admin/ManagerCourse/AdminDetailCourse'
import GuestView from './pages/GuestView'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'
import UserDashboard from './pages/Dashboard/UserDashboard'
import UserProfileForm from './components/Student/UserProfileForm'
import RequireAuth from './context/RequireAuth'
import { AuthProvider } from './context/AuthContext'
import ViewCourseDetails from './pages/ViewCourseDetails'
import AdminViewClassDetails from './components/Admin/ManagerClass/AdminViewClassDetails'
import AdminViewSchedule from './components/Admin/ManagerClass/AdminViewShedule'
import TeacherClassDetail from './components/Teacher/TeacherMangeClass/TeacherClassDetail'
import AttendanceForm from './components/Teacher/AttendanceForm'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import VNPay from './pages/vnPay';
import PaymentResult from './pages/PaymentResult';
import { UserDoingTest } from './components/Student/UserDoingTest';
import TeacherManageTest from './components/Teacher/TeacherMangeClass/TeacherManageTest'
import TeacherCreateTestQuestion from './components/Teacher/TeacherMangeClass/TeacherCreateTestQuestion';
import TeacherOverview from './components/Teacher/TeacherMangeClass/TeacherOverview'
import TeacherDashboardLayout from './components/Layouts/TeacherDashboardLayout'
import TeacherDashboard from './pages/Dashboard/TeacherDasboard'
import TeacherViewShedule from './components/Teacher/TeacherViewShedule'

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
        <Route path="/teacher/class/:classId" element={<TeacherClassDetail />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/attendance/:classId" element={<AttendanceForm />} />
          <Route path="/teacher/*" element={<TeacherDashboardLayout />}>
            <Route index element={<TeacherOverview />} />
            <Route path="overview" element={<TeacherOverview />} />
            <Route path="exams" element={<TeacherManageTest />} />
            <Route path="exams-create" element={<TeacherCreateTestQuestion />} />
            <Route path="schedule" element={<TeacherViewShedule />} />
          </Route>
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