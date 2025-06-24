import { useState } from "react";
import NavBar from "../../components/Layouts/NavBar";
import StudentSideMenu from "../../components/Layouts/StudentSideMenu";
import UserProfileForm from "../../components/Student/UserProfileForm";
import UserPasswordForm from "../../components/Student/UserPasswordForm";
import UserSchedule from "../../components/Student/UserSchedule";
import UserAttendance from "../../components/Student/UserAttendance";
import StudentTest from "../../components/Student/StudentTest";
import UserTest from "../../components/Student/UserTest";
import UserOverView from "../../components/Student/UserOverView";
import StudentOfCourses from "../../components/Student/StudentOfCourses";
function UserDashboard({ selectedPage }) {
  const [currentPage, setCurrentPage] = useState(selectedPage || "overview");

  return (
    <div className="h-screen flex flex-col">
      <header className="w-full">
        <NavBar />
      </header>
      <div className="flex flex-1" style={{ backgroundColor: "#F1F6FA" }}>
        <div>
          <StudentSideMenu
            onMenuSelect={(key) => setCurrentPage(key)}
            selectedKey={currentPage}
          />
        </div>
        <div className="flex-1">
          {currentPage === "overview" && <UserOverView />}
          {currentPage === "profile" && <UserProfileForm />}
          {currentPage === "password" && <UserPasswordForm />}
          {currentPage === "schedule" && <UserSchedule />}
          {currentPage === "attendance" && <UserAttendance />}
          {/* {currentPage === "test" && <StudentTest />} */}

          {currentPage === 'test' && <UserTest />}
          {currentPage === "courses" && <StudentOfCourses />}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
