import {
  FaHome,
  FaCalendarAlt,
  FaCheckSquare,
  FaBook,
  FaAddressBook,
  FaAlignJustify,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { FactoryIcon } from "lucide-react";

const StudentSideMenu = ({ onMenuSelect, selectedKey }) => {
  const navigate = useNavigate();
  const [isClassOpen, setIsClassOpen] = useState(false);
  const baseClass = "p-3 text-gray-700 flex items-center gap-2 cursor-pointer";
  const hoverClass = "hover:bg-blue-100 hover:text-blue-900";

  const toggleClassDropdown = () => {
    setIsClassOpen(!isClassOpen);
  };

  return (
    <div className="flex-1 shadow p-6  bg-white  w-64 min-h-full">
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
        <li
          className="text-gray-700 p-3 flex items-center justify-between cursor-pointer transition rounded-lg hover:bg-blue-100 hover:text-blue-900"
          onClick={toggleClassDropdown}
        >
          <span className="flex items-center gap-2">
            <FaAddressBook /> My Class
          </span>
          {isClassOpen ? <FaChevronUp /> : <FaChevronDown />}
        </li>

        {isClassOpen && (
          <ul className=" space-y-2">
            <li
              className={`text-gray-600 p-2 flex items-center gap-2 cursor-pointer rounded-md
              ${
                selectedKey === "schedule"
                  ? "bg-blue-50 font-semibold text-blue-800"
                  : ""
              }
              hover:bg-blue-50 hover:text-blue-800`}
              onClick={() => onMenuSelect && onMenuSelect("schedule")}
            >
              <FaCalendarAlt /> Schedule
            </li>
            <li
              className={`text-gray-600 p-2 flex items-center gap-2 cursor-pointer rounded-md
              ${
                selectedKey === "test"
                  ? "bg-blue-50 font-semibold text-blue-800"
                  : ""
              }
              hover:bg-blue-50 hover:text-blue-800`}
              onClick={() => onMenuSelect && onMenuSelect("test")}
            >
              <FactoryIcon /> Test
            </li>
            <li
              className={`text-gray-600 p-2 flex items-center gap-2 cursor-pointer rounded-md
              ${
                selectedKey === "attendance"
                  ? "bg-blue-50 font-semibold text-blue-800"
                  : ""
              }
              hover:bg-blue-50 hover:text-blue-800`}
              onClick={() => onMenuSelect && onMenuSelect("attendance")}
            >
              <FaCheckSquare /> Attendance
            </li>
            <li
              className={`text-gray-600 p-2 flex items-center gap-2 cursor-pointer rounded-md
              ${
                selectedKey === "courses"
                  ? "bg-blue-50 font-semibold text-blue-800"
                  : ""
              }
              hover:bg-blue-50 hover:text-blue-800`}
              onClick={() => onMenuSelect && onMenuSelect("courses")}
            >
              <FaAlignJustify /> My Courses
            </li>
          </ul>
        )}
<li
  className={`text-gray-700 flex items-center gap-2 cursor-pointer transition rounded-lg
    ${selectedKey === 'test' ? 'bg-blue-100 text-blue-900 font-bold' : ''}
    hover:bg-blue-100 hover:text-blue-900`}
  onClick={() => onMenuSelect && onMenuSelect('test')}
>
  <FaBook /> Test
</li>

      </ul>
      <div className=" pb-4">
        <hr className="my-3" />
        <div
          className={`${baseClass} ${hoverClass} border border-gray-200 rounded-lg`}
          onClick={() => navigate("/")}
        >
          <FaBook /> Home Page
        </div>
      </div>
    </div>
  );
};

export default StudentSideMenu;
