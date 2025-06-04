import React from "react";
import { FaUser, FaLock } from 'react-icons/fa';

const StudentSideProfile = ({ onMenuSelect, selectedKey }) => {
  const baseClass = "text-gray-700 flex items-center gap-2 cursor-pointer transition rounded-lg px-4 py-2 text-sm";
  const selectedClass = "bg-[#EBF5FF] text-blue-900 font-bold";
  const hoverClass = "hover:bg-[#67B3FF] hover:text-white";

  return (
    <div className="flex flex-col justify-between  pr-10 pt-6 w-64 bg-white h-screen shadow border border-gray-300">
      <ul className="flex flex-col gap-2">
        <li className={`${baseClass} ${selectedKey === 'profile' ? selectedClass : ''} ${hoverClass}`} onClick={() => onMenuSelect('profile')}>
          <FaUser /> Account
        </li>
        <li className={`${baseClass} ${selectedKey === 'password' ? selectedClass : ''} ${hoverClass}`} onClick={() => onMenuSelect('password')}>
          <FaLock /> Password
        </li>
      </ul>
    </div>
  );
};

export default StudentSideProfile;