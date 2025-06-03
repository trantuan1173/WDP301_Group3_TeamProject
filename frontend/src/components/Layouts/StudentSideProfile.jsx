// import { FaHome, FaUser, FaCalendarAlt, FaCheckSquare, FaLock, FaBook, FaAddressBook } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';

// const StudentSideProfile = ({ onMenuSelect, selectedKey }) => {
//   const navigate = useNavigate();

//   const baseItemClass = "text-gray-700 flex items-center gap-2 cursor-pointer transition rounded-lg px-4 py-2 text-sm";
//   const selectedClass = "bg-[#EBF5FF] text-blue-900 font-bold";
//   const hoverClass = "hover:bg-[#67B3FF] hover:text-white";
//   return (
//   <div
//     className="flex flex-col justify-between rounded shadow pr-10 pt-6 m-4 w-64 bg-white h-screen"
//     style={{
//       border: "1px solid #D6BDBD",
//       borderRadius: "10px",
//       backgroundColor: "#FFFFFF",
//     }}
//   >

//     <ul className="flex flex-col gap-2">
   
//       {/* <li className="text-gray-400 px-4">Account Management</li> */}

//       <li
//         className={`${baseItemClass} ${selectedKey === 'profile' ? selectedClass : ''} ${hoverClass}`}
//         onClick={() => onMenuSelect && onMenuSelect('profile')}
//       >
//         <FaUser /> Account
//       </li>

//       <li
//         className={`${baseItemClass} ${selectedKey === 'password' ? selectedClass : ''} ${hoverClass}`}
//         onClick={() => onMenuSelect && onMenuSelect('password')}
//       >
//         <FaLock /> Password
//       </li>

//     </ul>

//      </div>

// );

// };

// export default StudentSideProfile;
// StudentSideProfile.jsx
import { FaUser, FaLock } from 'react-icons/fa';

const StudentSideProfile = ({ onMenuSelect, selectedKey }) => {
  const baseClass = "text-gray-700 flex items-center gap-2 cursor-pointer transition rounded-lg px-4 py-2 text-sm";
  const selectedClass = "bg-[#EBF5FF] text-blue-900 font-bold";
  const hoverClass = "hover:bg-[#67B3FF] hover:text-white";

  return (
    <div className="flex flex-col rounded shadow pr-10 pt-6 m-4 w-64 bg-white h-screen border border-gray-300">
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