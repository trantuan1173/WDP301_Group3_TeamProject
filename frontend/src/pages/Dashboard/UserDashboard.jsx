import { useState } from 'react';
import NavBar from "../../components/Layouts/NavBar";
import StudentSideMenu from '../../components/Layouts/StudentSideMenu';
import UserProfileForm from '../../components/Student/UserProfileForm';


function UserDashboard({ selectedPage }) {
  const [currentPage, setCurrentPage] = useState(selectedPage || 'profile');

  return (
    <div className="flex">
      <StudentSideMenu
        onMenuSelect={(key) => setCurrentPage(key)}
        selectedKey={currentPage}
      />
      <div className="flex-1">
        <NavBar />
        {currentPage === 'profile' && <UserProfileForm />}
      </div>
    </div>
  );
}

export default UserDashboard;