import { useState, useEffect  } from 'react';
import { useLocation } from 'react-router-dom'; 
import NavBar from "../../components/Layouts/NavBar";
import AdminSideMenu from '../../components/Layouts/AdminSideMenu';
import AdminManageAccount from '../../components/Admin/ManagerAccount/AdminManageAccount';
import AdminManageCourse from '../../components/Admin/ManagerCourse/AdminManageCourse';
import AdminManageClass from '../../components/Admin/ManagerClass/AdminManageClass';
import AdminOverView from '../../components/Admin/AdminOverView/AdminOverView';
import AdminStatistics from '../../components/Admin/AdminStatistics/AdminStatistics';
import AdminManageEnrollment from '../../components/Admin/ManageEnrollment/AdminManageEnrollment';


function AdminDashboard() {
  const [selectedPage, setSelectedPage] = useState('overview');
  const location = useLocation();
  useEffect(() => {
    if (location.state?.selectedPage) {
      setSelectedPage(location.state.selectedPage);
    }
  }, [location.state]);

  return (
    <div className="h-screen flex flex-col">
      <header className="w-full ">
        <NavBar />
      </header>
      <div className="flex flex-1">
        <AdminSideMenu
          onMenuSelect={(key) => setSelectedPage(key)}
          selectedKey={selectedPage}
        />
        <div className="flex-1">
          {selectedPage === 'overview' && <AdminOverView onQuickAction={setSelectedPage} />}
          {selectedPage === 'account' && <AdminManageAccount />}
          {selectedPage === 'courses' && <AdminManageCourse />}
          {selectedPage === 'classes' && <AdminManageClass/>}
          {selectedPage === 'enrollment' && <AdminManageEnrollment />}
          {selectedPage === 'statistics' && <AdminStatistics />}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;