// frontend/src/components/Layouts/TeacherDashboardLayout.jsx
import React from "react";
import { Row, Col } from "react-bootstrap";
import NavBar from "./NavBar";
import TeacherSideMenu from "./TeacherSideMenu";
import { Outlet } from "react-router-dom";

// export default function TeacherDashboardLayout() {
//   return (
//     <div className="h-screen flex flex-col">
//       <header>
//         <NavBar />
//       </header>
//       <div className="flex min-h-screen bg-gray-50">
//         <TeacherSideMenu />
//         <div className="flex-1 p-4">
//           <Outlet /> {/* Render page content here */}
//         </div>
//       </div>
//     </div>
//   );
// }

export default function TeacherDashboardLayout() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header cố định */}
      <header className="flex-none">
        <NavBar />
      </header>

      {/* Body: side menu + content */}
      <div className="flex flex-1 overflow-hidden bg-gray-50">
        <TeacherSideMenu />

        <div className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
