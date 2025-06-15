import React, { useState } from "react";
import TeacherSideMenu from "../../components/Layouts/TeacherSideMenu";
import NavBar from "../../components/Layouts/NavBar";
import TeacherViewShedule from "../../components/Teacher/TeacherViewShedule";
import TeacherOverView from "../../components/Teacher/TeacherOverView";
import TeacherViewClass from "../../components/Teacher/TeacherMangeClass/TeacherViewClass";
import TeacherManageTest from "../../components/Teacher/TeacherMangeClass/TeacherManageTest";
import TeacherViewScore from "../../components/Teacher/TeacherMangeClass/TeacherViewScore";

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
          {selectedKey === "overview" && <TeacherOverView />}
          {selectedKey === "schedule" && <TeacherViewShedule />}
          {selectedKey === "classes" && <TeacherViewClass />}
          {selectedKey === "exams" && <TeacherManageTest />}
          {selectedKey === "scores" && <TeacherViewScore />}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;