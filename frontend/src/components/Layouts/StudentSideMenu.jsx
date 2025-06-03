import { FaHome, FaUser, FaCalendarAlt, FaCheckSquare, FaLock, FaAddressBook, FaBook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const StudentSideMenu = ({ onMenuSelect, selectedKey }) => {
  const navigate = useNavigate();
  const baseClass = "text-gray-700 flex items-center gap-2 cursor-pointer transition rounded-lg px-4 py-2 text-sm";
  const selectedClass = "bg-[#EBF5FF] text-blue-900 font-bold";
  const hoverClass = "hover:bg-[#67B3FF] hover:text-white";

  return (
    <div className="flex flex-col justify-between rounded shadow pr-10 pt-6 m-4 w-64 bg-white h-screen border border-gray-300">
      <ul className="flex flex-col gap-2">
        <li className={`${baseClass} ${selectedKey === 'overview' ? selectedClass : ''} ${hoverClass}`} onClick={() => onMenuSelect('overview')}>
          <FaHome /> Overview
        </li>
        {/* <li className={`${baseClass} ${selectedKey === 'profile' ? selectedClass : ''} ${hoverClass}`} onClick={() => onMenuSelect('profile')}>
          <FaUser /> Account
        </li>
        <li className={`${baseClass} ${selectedKey === 'password' ? selectedClass : ''} ${hoverClass}`} onClick={() => onMenuSelect('password')}>
          <FaLock /> Password
        </li> */}
        <li className={`${baseClass} ${selectedKey === 'schedule' ? selectedClass : ''} ${hoverClass}`} onClick={() => onMenuSelect('schedule')}>
          <FaCalendarAlt /> Schedule
        </li>
        <li className={`${baseClass} ${selectedKey === 'attendance' ? selectedClass : ''} ${hoverClass}`} onClick={() => onMenuSelect('attendance')}>
          <FaCheckSquare /> Attendance
        </li>
        <li className={`${baseClass} ${selectedKey === 'class' ? selectedClass : ''} ${hoverClass}`} onClick={() => onMenuSelect('class')}>
          <FaAddressBook /> Class
        </li>
      </ul>
      <div className="pl-4 pb-4">
        <hr className="my-3" />
        <div className={`${baseClass} ${hoverClass} border border-gray-200 rounded-lg`} onClick={() => navigate("/")}>
          <FaBook /> Home Page
        </div>
      </div>
    </div>
  );
};

export default StudentSideMenu;
