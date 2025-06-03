import React from "react";
import TeacherSideMenu from "../../components/Layouts/TeacherSideMenu";
import NavBar from "../../components/Layouts/NavBar";

const TeacherDashboard = () => {
  return (
    <div className="h-screen flex flex-col">
          <header className="w-full">
            <NavBar />
          </header>
         
    <div className="flex min-h-screen bg-gray-50">
      <TeacherSideMenu />
      <div className="flex-1 p-4">
        {/* Nội dung dashboard ở đây */}
        <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
      </div>
    </div>
  </div>
  );
};

export default TeacherDashboard;