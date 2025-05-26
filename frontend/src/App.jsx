import React from 'react'


import AdminDashboard from './pages/Dashboard/AdminDashboard'
import Register from './pages/Auth/Register'
import Login from './pages/Auth/Login'
import VerifyPage from './pages/Auth/VerifyPage'
import { Routes, Route } from 'react-router-dom'

import AdminDetailCourse from './components/Admin/ManagerCourse/AdminDetailCourse'
import GuestView from './pages/Homepage/GuestView'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'
import UserDashboard from './pages/Dashboard/UserDashboard'
import UserProfileForm from './components/Student/UserProfileForm'
import RequireAuth from './context/RequireAuth'
import { AuthProvider } from './context/AuthContext'
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/course/:id" element={<AdminDetailCourse />} />
        <Route element={<RequireAuth allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={["student", "teacher", "admin"]} />}>
          <Route path="/update-profile" element={<UserDashboard selectedPage="profile" />} />
        </Route>
        <Route path="/verify/:token" element={<VerifyPage />} />
        <Route path="/" element={<GuestView />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </AuthProvider>
  )
}

export default App;