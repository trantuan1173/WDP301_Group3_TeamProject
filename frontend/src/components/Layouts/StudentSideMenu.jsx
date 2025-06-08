import {
  FaHome,
  FaUser,
  FaCalendarAlt,
  FaCheckSquare,
  FaLock,
  FaBook,
  FaAddressBook,
  FaAlignJustify,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const StudentSideMenu = ({ onMenuSelect, selectedKey }) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="flex-1 shadow p-6  w-64 bg-white h-screen"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <ul
          className="space-y-3 pl-0 text-left"
          style={{ paddingLeft: 0, marginLeft: 0 }}
        >
          <li
            className={`text-gray-700 p-3 flex items-center gap-2 cursor-pointer transition rounded-lg
    ${selectedKey === "overview" ? "bg-blue-100 text-blue-900 font-bold" : ""}
    hover:bg-blue-100 hover:text-blue-900`}
            onClick={() => onMenuSelect && onMenuSelect("overview")}
          >
            <FaHome /> Overview
          </li>

          {/* <li className="text-gray-400">Account Management</li> */}
          {/* <li
            className={`text-gray-700 p-3 flex items-center gap-2 cursor-pointer transition rounded-lg
    ${selectedKey === "profile" ? "bg-blue-100   text-blue-900 font-bold" : ""}
    hover:bg-blue-100 hover:text-blue-900`}
            onClick={() => onMenuSelect && onMenuSelect("profile")}
          >
            <FaUser /> Account
          </li>
          <li
            className={`text-gray-700 p-3 flex items-center gap-2 cursor-pointer transition rounded-lg
    ${selectedKey === "password" ? "bg-blue-100 text-blue-900 font-bold" : ""}
    hover:bg-blue-100 hover:text-blue-900`}
            onClick={() => onMenuSelect && onMenuSelect("password")}
          >
            <FaLock /> Password
          </li> */}
          <li
            className={`text-gray-700 p-3 flex items-center gap-2 cursor-pointer transition rounded-lg
    ${selectedKey === "schedule" ? "bg-blue-100 text-blue-900 font-bold" : ""}
    hover:bg-blue-100 hover:text-blue-900`}
            onClick={() => onMenuSelect && onMenuSelect("schedule")}
          >
            <FaCalendarAlt /> Schedule
          </li>
          <li
            className={`text-gray-700 p-3 flex items-center gap-2 cursor-pointer transition rounded-lg
    ${selectedKey === "attendance" ? "bg-blue-100 text-blue-900 font-bold" : ""}
    hover:bg-blue-100 hover:text-blue-900`}
            onClick={() => onMenuSelect && onMenuSelect("attendance")}
          >
            <FaCheckSquare /> Attendance
          </li>
          <li
            className={`text-gray-700 p-3 flex items-center gap-2 cursor-pointer transition rounded-lg
    ${selectedKey === "class" ? "bg-blue-100 text-blue-900 font-bold" : ""}
    hover:bg-blue-100 hover:text-blue-900`}
            onClick={() => onMenuSelect && onMenuSelect("class")}
          >
            <FaAddressBook /> My Class
          </li>
          <li
            className={`text-gray-700 p-3 flex items-center gap-2 cursor-pointer transition rounded-lg
    ${selectedKey === "courses" ? "bg-blue-100 text-blue-900 font-bold" : ""}
    hover:bg-blue-100 hover:text-blue-900`}
            onClick={() => onMenuSelect && onMenuSelect("courses")}
          >
            <FaAlignJustify /> My Courses
          </li>
          <hr />
          <li
            className={`text-gray-700 p-3 flex items-center gap-2 cursor-pointer transition rounded-lg
    hover:bg-blue-100 hover:text-blue-900`}
            onClick={() => navigate("/")}
          >
            <FaBook /> Home Page
          </li>
        </ul>
      </div>
    </>
  );
};

export default StudentSideMenu;
