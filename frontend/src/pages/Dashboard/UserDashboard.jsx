import React from "react";
import { useState, useEffect } from "react";
import NavBar from "../../components/Layouts/NavBar";
import StudentSideMenu from "../../components/Layouts/StudentSideMenu";
import StudentSideProfile from "../../components/Layouts/StudentSideProfile";

import UserProfileForm from "../../components/Student/UserProfileForm";
import UserPasswordForm from "../../components/Student/UserPasswordForm";
import UserSchedule from "../../components/Student/UserSchedule";
import UserAttendance from "../../components/Student/UserAttendance";
import UserClass from "../../components/Student/UserClass";
import UserOverView from "../../components/Student/UserOverView";

function UserDashboard({ selectedPage = "overview", sidebarType = "default" }) {
  const [currentPage, setCurrentPage] = useState(selectedPage);

  useEffect(() => {
    setCurrentPage(selectedPage);
  }, [selectedPage]);
  const renderSidebar = () => {
    return sidebarType === "profile" ? (
      <StudentSideProfile
        onMenuSelect={setCurrentPage}
        selectedKey={currentPage}
      />
    ) : (
      <StudentSideMenu
        onMenuSelect={setCurrentPage}
        selectedKey={currentPage}
      />
    );
  };

  const renderContent = () => {
    switch (currentPage) {
      case "overview":
        return <UserOverView />;
      case "profile":
        return <UserProfileForm />;
      case "password":
        return <UserPasswordForm />;
      case "schedule":
        return <UserSchedule />;
      case "attendance":
        return <UserAttendance />;
      case "class":
        return <UserClass />;
      default:
        return <div className="p-4 text-red-500">Page not found.</div>;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="w-full">
        <NavBar />
      </header>
      <div className="flex flex-1 bg-[#F1F6FA]">
        <div>{renderSidebar()}</div>
        <div className="flex-1 p-4">{renderContent()}</div>
      </div>
    </div>
  );
}

export default UserDashboard;
