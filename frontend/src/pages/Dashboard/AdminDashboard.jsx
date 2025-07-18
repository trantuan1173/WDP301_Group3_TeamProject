import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../../components/Layouts/NavBar";
import AdminSideMenu from '../../components/Layouts/AdminSideMenu';
import AdminManageAccount from '../../components/Admin/ManagerAccount/AdminManageAccount';
import AdminManageCourse from '../../components/Admin/ManagerCourse/AdminManageCourse';
import AdminManageClass from '../../components/Admin/ManagerClass/AdminManageClass';
import AdminOverView from '../../components/Admin/AdminOverView/AdminOverView';
import AdminStatistics from '../../components/Admin/AdminStatistics/AdminStatistics';
import AdminManageEnrollment from '../../components/Admin/ManageEnrollment/AdminManageEnrollment';

export default function AdminDashboard() {
  const { selectedPage } = useParams();
  const navigate = useNavigate();

  const handleMenuSelect = (key) => {
    navigate(`/admin/${key}`);
  };

  return (
    <div className="h-screen">
      <header className="fixed top-0 left-0 right-0 z-50">
        <NavBar />
      </header>

      <aside className="fixed top-25 left-0 bottom-0 w-60 bg-white shadow-lg border-r border-white-100 z-40">
        <AdminSideMenu
          onMenuSelect={handleMenuSelect}
          selectedKey={selectedPage || 'overview'}
        />
      </aside>

      <main className="ml-60 pt-20 p-6 h-screen overflow-auto bg-gray-100">
        <div className="bg-white rounded-lg shadow p-6 min-h-full">
          {selectedPage === 'overview' && <AdminOverView onQuickAction={handleMenuSelect} />}
          {selectedPage === 'account' && <AdminManageAccount />}
          {selectedPage === 'courses' && <AdminManageCourse />}
          {selectedPage === 'classes' && <AdminManageClass />}
          {selectedPage === 'enrollment' && <AdminManageEnrollment />}
          {selectedPage === 'statistics' && <AdminStatistics />}
        </div>
      </main>
    </div>
  );
}

