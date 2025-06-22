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
const StudentSideProfile = ({ onMenuSelect, selectedKey }) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="flex-1 shadow p-6  w-64 min-h-full"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <ul
          className="space-y-3 pl-0 text-left"
          style={{ paddingLeft: 0, marginLeft: 0 }}
        >
          <li
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
          </li>
        </ul>
      </div>
    </>
  );
};

export default StudentSideProfile;
