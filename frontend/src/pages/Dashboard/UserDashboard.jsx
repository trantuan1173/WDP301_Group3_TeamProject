import { useState } from 'react';
import NavBar from "../../components/Layouts/NavBar";
import StudentSideMenu from '../../components/Layouts/StudentSideMenu';
import UserProfileForm from '../../components/Student/UserProfileForm';


function UserDashboard({ selectedPage }) {
  const [currentPage, setCurrentPage] = useState(selectedPage || 'profile');

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <div className="flex flex-1">
        <div className="">
          <StudentSideMenu
            onMenuSelect={(key) => setCurrentPage(key)}
            selectedKey={currentPage}
          />
        </div>
        <div className="flex-1">
          {currentPage === 'profile' && <UserProfileForm />}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;