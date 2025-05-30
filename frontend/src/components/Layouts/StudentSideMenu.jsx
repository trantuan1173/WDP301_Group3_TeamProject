import { FaHome, FaUser, FaCalendarAlt, FaCheckSquare, FaLock, FaBook, FaAddressBook } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
const StudentSideMenu = ({ onMenuSelect, selectedKey }) => {
  const navigate = useNavigate();
  return (
    <div className="flex-1 rounded shadow p-6 m-4 w-64 bg-white h-screen" style={{ border: "1px solid #D6BDBD", borderRadius: "10px", backgroundColor: "#FFFFFF" }}>
      <ul className="space-y-4 pl-0 text-left" style={{ paddingLeft: 0, marginLeft: 0 }}>
        <li
  className={`text-gray-700 flex items-center gap-2 cursor-pointer transition
    ${selectedKey === 'overview' ? 'bg-blue-100 text-blue-900 font-bold' : ''}
    hover:bg-blue-100 hover:text-blue-900`}
  onClick={() => onMenuSelect && onMenuSelect('overview')}
>
  <FaHome /> Overview
</li>
<li
  className={`text-gray-700 flex items-center gap-2 cursor-pointer transition
    hover:bg-blue-100 hover:text-blue-900`}
  onClick={() => navigate('/')}
>
  <FaBook /> Home Page
</li>
<li className="text-gray-400">Account Management</li>
<li
  className={`text-gray-700 flex items-center gap-2 cursor-pointer transition rounded-lg
    ${selectedKey === 'profile' ? 'bg-blue-100   text-blue-900 font-bold' : ''}
    hover:bg-blue-100 hover:text-blue-900`}
  onClick={() => onMenuSelect && onMenuSelect('profile')}
>
  <FaUser /> Account
</li>
<li
  className={`text-gray-700 flex items-center gap-2 cursor-pointer transition rounded-lg
    ${selectedKey === 'password' ? 'bg-blue-100 text-blue-900 font-bold' : ''}
    hover:bg-blue-100 hover:text-blue-900`}
  onClick={() => onMenuSelect && onMenuSelect('password')}
>
  <FaLock /> Password
</li>
<li
  className={`text-gray-700 flex items-center gap-2 cursor-pointer transition rounded-lg
    ${selectedKey === 'schedule' ? 'bg-blue-100 text-blue-900 font-bold' : ''}
    hover:bg-blue-100 hover:text-blue-900`}
  onClick={() => onMenuSelect && onMenuSelect('schedule')}
>
  <FaCalendarAlt /> Schedule
</li>
<li
  className={`text-gray-700 flex items-center gap-2 cursor-pointer transition rounded-lg
    ${selectedKey === 'attendance' ? 'bg-blue-100 text-blue-900 font-bold' : ''}
    hover:bg-blue-100 hover:text-blue-900`}
  onClick={() => onMenuSelect && onMenuSelect('attendance')}
>
  <FaCheckSquare /> Attendance
</li>
<li
  className={`text-gray-700 flex items-center gap-2 cursor-pointer transition rounded-lg
    ${selectedKey === 'class' ? 'bg-blue-100 text-blue-900 font-bold' : ''}
    hover:bg-blue-100 hover:text-blue-900`}
  onClick={() => onMenuSelect && onMenuSelect('class')}
>
  <FaAddressBook /> Class
</li>
      </ul>
    </div>
  );
};

export default StudentSideMenu;