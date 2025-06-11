import { useState } from "react";
import NavBar from "../../components/Layouts/NavBar";
import UserProfileForm from "../../components/Student/UserProfileForm";
import UserPasswordForm from "../../components/Student/UserPasswordForm";

import StudentSideProfile from "../../components/Layouts/StudentSideProfile";
function StudentProfileDashboard({ selectedPage }) {
  const [currentPage, setCurrentPage] = useState(selectedPage || "profile");

  return (
    <div className="h-screen flex flex-col">
      <header className="w-full">
        <NavBar />
      </header>
      <div className="flex flex-1" style={{ backgroundColor: "#F1F6FA" }}>
        <div>
          <StudentSideProfile
            onMenuSelect={(key) => setCurrentPage(key)}
            selectedKey={currentPage}
          />
        </div>
        <div className="flex-1">
          {currentPage === "profile" && <UserProfileForm />}
          {currentPage === "password" && <UserPasswordForm />}

        </div>
      </div>
    </div>
  );
}

export default StudentProfileDashboard;
