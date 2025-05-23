import React from 'react'


import AdminDashboard from './pages/Dashboard/AdminDashboard'
import Register from './pages/Auth/Register'
import Login from './pages/Auth/Login'
import VerifyPage from './pages/Auth/VerifyPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminDetailCourse from './components/Admin/ManagerCourse/AdminDetailCourse'
import GuestView from './pages/Homepage/GuestView'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
              <Route path="/admin/course/:id" element={<AdminDetailCourse />} />

          <Route path="/admin" element={<AdminDashboard/>}/>
          <Route path="/verify/:token" element={<VerifyPage />} />
          <Route path="/" element={<GuestView />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;