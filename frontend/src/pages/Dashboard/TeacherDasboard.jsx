import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TeacherSideMenu from "../../components/Layouts/TeacherSideMenu";
import NavBar from "../../components/Layouts/NavBar";
import TeacherViewShedule from "../../components/Teacher/TeacherViewShedule";
import TeacherOverView from "../../components/Teacher/TeacherOverView/TeacherOverView";
import TeacherViewClass from "../../components/Teacher/TeacherMangeClass/TeacherViewClass";
import TeacherClassDetail from "../../components/Teacher/TeacherMangeClass/TeacherClassDetail";
// import TeacherManageTest from "../../components/Teacher/TeacherMangeClass/TeacherManageTest";
import TeacherViewScore from "../../components/Teacher/TeacherMangeClass/TeacherViewScore";
import UserProfileForm from "../../components/Student/UserProfileForm";

const TeacherDashboard = () => {
  const { selectedPage } = useParams();
  const navigate = useNavigate();
  const [selectedClassId, setSelectedClassId] = useState(null);

  // Xác định tab mặc định từ URL param hoặc "overview"
  const [selectedKey, setSelectedKey] = useState(selectedPage || "overview");

  // Hàm chuyển tab và cập nhật URL
  const handleMenuSelect = (key) => {
    setSelectedKey(key);
    setSelectedClassId(null);
    navigate(`/teacher/${key}`);
  };

  return (
    <div className="flex flex-col">
      <header className="w-full">
        <NavBar />
      </header>
      <div className="flex min-h-screen bg-gray-50 ">
        <TeacherSideMenu
          selectedKey={selectedKey}
          onMenuSelect={handleMenuSelect}
        />
        <div className="flex-1 p-4">
          {selectedKey === "overview" && (
            <TeacherOverView onQuickAction={handleMenuSelect} />
          )}
          {selectedKey === "profile" && <UserProfileForm />}
          {selectedKey === "schedule" && <TeacherViewShedule />}
          {selectedKey === "classes" && (
            selectedClassId
              ? <TeacherClassDetail classId={selectedClassId} onBack={() => setSelectedClassId(null)} />
              : <TeacherViewClass onViewClass={setSelectedClassId} />
          )}
          {/* {selectedKey === "exams" && <TeacherManageTest />} */}
          {selectedKey === "scores" && <TeacherViewScore />}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;