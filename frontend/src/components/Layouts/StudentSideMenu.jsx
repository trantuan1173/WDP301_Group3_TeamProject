import { FaHome, FaUser, FaCalendarAlt, FaCheckSquare, FaLock, FaBook } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
const StudentSideMenu = ({ onMenuSelect, selectedKey}) => {
   const navigate = useNavigate();
    return (
    <div className="flex-1 rounded shadow p-6 m-4 w-64 bg-white h-screen" style={{ border: "1px solid #D6BDBD", borderRadius: "10px", backgroundColor: "#FFFFFF" }}>
      <ul className="space-y-4 pl-0 text-left" style={{ paddingLeft: 0, marginLeft: 0 }}>
        <li
          className={`text-gray-700 flex items-center gap-2 cursor-pointer ${selectedKey === 'profile' ? 'font-bold' : ''}`}
          onClick={() => onMenuSelect && onMenuSelect('overview')}
        >
          <FaHome /> Overview
        </li>
        <li className="text-gray-400">Account Management</li>
        <li
          className={`bg-blue-100 text-blue-700 p-2 rounded flex items-center gap-2 cursor-pointer ${selectedKey === 'account' ? 'font-bold' : ''}`}
          onClick={() => onMenuSelect && onMenuSelect('profile')}
        >
          <FaUser /> Account
        </li>
        <li
          className={`text-gray-700 flex items-center gap-2 cursor-pointer ${selectedKey === 'password' ? 'font-bold' : ''}`}
          onClick={() => onMenuSelect && onMenuSelect('password')}
        >
          <FaLock /> Password
        </li>
        <li
          className={`text-gray-700 flex items-center gap-2 cursor-pointer ${selectedKey === 'schedule' ? 'font-bold' : ''}`}
          onClick={() => onMenuSelect && onMenuSelect('schedule')}
        >
          <FaCalendarAlt /> Schedule
        </li>
        <li
          className={`text-gray-700 flex items-center gap-2 cursor-pointer ${selectedKey === 'attendance' ? 'font-bold' : ''}`}
          onClick={() => onMenuSelect && onMenuSelect('attendance')}
        >
          <FaCheckSquare /> Attendance
        </li>
        <li
          className={`text-gray-700 flex items-center gap-2 cursor-pointer ${selectedKey === 'class' ? 'font-bold' : ''}`}
          onClick={() => onMenuSelect && onMenuSelect('class')}
        >
          <FaBook /> Class
        </li>
      </ul>
    </div>
  );
};

export default StudentSideMenu;