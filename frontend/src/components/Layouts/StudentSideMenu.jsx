import { FaHome, FaUser, FaCalendarAlt, FaCheckSquare, FaLock } from 'react-icons/fa';

const StudentSideMenu = () => {
  return (
    <div className="w-64 bg-white shadow p-4">
      <h1 className="text-xl font-bold mb-6 text-blue-700">SMART<br />ENGLISH CENTER</h1>
      <ul className="space-y-4">
        <li className="text-gray-700 flex items-center gap-2">
          <FaHome /> Overview
        </li>
        <li className="text-gray-400">Quản lý tài khoản</li>
        <li className="bg-blue-100 text-blue-700 p-2 rounded flex items-center gap-2">
          <FaUser /> Tài Khoản
        </li>
        <li className="text-gray-700 flex items-center gap-2">
          <FaLock /> Mật Khẩu
        </li>
        <li className="text-gray-700 flex items-center gap-2">
          <FaCalendarAlt /> Lịch học
        </li>
        <li className="text-gray-700 flex items-center gap-2">
          <FaCheckSquare /> Điểm danh
        </li>
        <li className="text-gray-700 flex items-center gap-2">
          <FaHome /> Lớp học
        </li>
      </ul>
    </div>
  );
};

export default StudentSideMenu;