import { useState } from "react";
import NavBar from "../../components/Layouts/NavBar";
import UserProfileForm from "../../components/Student/UserProfileForm";
import UserPasswordForm from "../../components/Student/UserPasswordForm";
import StudentSideProfile from "../../components/Layouts/StudentSideProfile";

function StudentProfileDashboard({ selectedPage }) {
  const [currentPage, setCurrentPage] = useState(selectedPage || "profile");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full">
        <NavBar />
      </header>

      <div className="flex flex-1 bg-[#F1F6FA]">
        <div className="w-64 bg-white shadow min-h-full">
          <StudentSideProfile
            onMenuSelect={(key) => setCurrentPage(key)}
            selectedKey={currentPage}
          />
        </div>

        <div className="flex-1 p-4">
          {currentPage === "profile" && <UserProfileForm />}
          {currentPage === "password" && <UserPasswordForm />}
        </div>
      </div>
    </div>
  );
}

export default StudentProfileDashboard;
