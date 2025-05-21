import { useState } from 'react';
import NavBar from "../../components/Layouts/NavBar";
import AdminSideMenu from '../../components/Layouts/AdminSideMenu';
import AdminManageAccount from '../../components/Admin/ManagerAccount/AdminManageAccount';
import AdminManageCourse from '../../components/Admin/ManagerCourse/AdminManageCourse';



function AdminDashboard() {
  const [selectedPage, setSelectedPage] = useState('overview');

  return (
    <div className="flex">
      <AdminSideMenu
        onMenuSelect={(key) => setSelectedPage(key)}
        selectedKey={selectedPage}
      />
      <div className="flex-1">
        <NavBar />
        {selectedPage === 'account' && <AdminManageAccount />}
        {selectedPage === 'courses' && <AdminManageCourse />}
        {/* Bạn có thể thêm các page khác tại đây nếu cần */}
      </div>
    </div>
  );
}

export default AdminDashboard;