import React, { useState } from "react";
import TeacherSideMenu from "../../components/Layouts/TeacherSideMenu";
import NavBar from "../../components/Layouts/NavBar";
import TeacherViewShedule from "../../components/Teacher/TeacherViewShedule";

const TeacherDashboard = () => {
  const [selectedKey, setSelectedKey] = useState("overview");

  return (
    <div className="h-screen flex flex-col">
      <header className="w-full">
        <NavBar />
      </header>
      <div className="flex min-h-screen bg-gray-50 ">
        <TeacherSideMenu
          selectedKey={selectedKey}
          onMenuSelect={setSelectedKey}
        />
        <div className="flex-1 p-4">
          {selectedKey === "overview" && (
            <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
          )}
          {selectedKey === "schedule" && <TeacherViewShedule />}
          {/* Thêm các trang khác nếu cần */}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;