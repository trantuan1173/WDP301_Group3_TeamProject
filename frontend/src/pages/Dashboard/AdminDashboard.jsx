import { useState } from 'react';
import NavBar from "../../components/Layouts/NavBar";
import AdminSideMenu from '../../components/Layouts/AdminSideMenu';
import AdminManageAccount from '../../components/Admin/ManagerAccount/AdminManageAccount';
import AdminManageCourse from '../../components/Admin/ManagerCourse/AdminManageCourse';
import AdminManageClass from '../../components/Admin/ManagerClass/AdminManageClass';



function AdminDashboard() {
  const [selectedPage, setSelectedPage] = useState('overview');

  return (
    <div className="h-screen flex flex-col">
      <header className="w-full">
        <NavBar />
      </header>
      <div className="flex flex-1">
        <AdminSideMenu
          onMenuSelect={(key) => setSelectedPage(key)}
          selectedKey={selectedPage}
        />
        <div className="flex-1">
          {selectedPage === 'account' && <AdminManageAccount />}
          {selectedPage === 'courses' && <AdminManageCourse />}
          {selectedPage === 'classes' && <AdminManageClass/>}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;