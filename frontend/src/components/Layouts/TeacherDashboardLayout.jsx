// frontend/src/components/Layouts/TeacherDashboardLayout.jsx
import React from "react";
import { Row, Col } from "react-bootstrap";
import NavBar from "./NavBar";
import TeacherSideMenu from "./TeacherSideMenu";
import { Outlet } from "react-router-dom";

export default function TeacherDashboardLayout() {
  return (
    <div className="h-screen flex flex-col">
      <header>
        <NavBar />
      </header>
      <div className="flex min-h-screen bg-gray-50">
        <TeacherSideMenu />
        <div className="flex-1 p-4">
          <Outlet /> {/* Render page content here */}
        </div>
      </div>
    </div>
  );
}
