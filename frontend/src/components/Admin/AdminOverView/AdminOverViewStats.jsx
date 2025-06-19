import React from "react";

export default function AdminOverviewStats({ accounts, courses }) {
  const totalStudent = accounts.filter(acc => acc.roleId?.nameRole === "student").length;
  const totalTeacher = accounts.filter(acc => acc.roleId?.nameRole === "teacher").length;
  const totalCourse = courses.length;
  // Giả lập doanh thu, bạn có thể lấy từ API nếu có
  const monthlyRevenue = 45231000;

  return (
    
    <div className="flex gap-6">
      <div className="bg-white rounded shadow p-6 flex-1 flex flex-col items-center">
        <div className="font-bold text-lg">Total Student</div>
        <div className="text-2xl font-bold">{totalStudent}</div>
      </div>
      <div className="bg-white rounded shadow p-6 flex-1 flex flex-col items-center">
        <div className="font-bold text-lg">Total Teacher</div>
        <div className="text-2xl font-bold">{totalTeacher}</div>
      </div>
      <div className="bg-white rounded shadow p-6 flex-1 flex flex-col items-center">
        <div className="font-bold text-lg">Course is open</div>
        <div className="text-2xl font-bold">{totalCourse}</div>
      </div>
      <div className="bg-white rounded shadow p-6 flex-1 flex flex-col items-center">
        <div className="font-bold text-lg">Monthly Revenue</div>
        <div className="text-2xl font-bold">₫{monthlyRevenue.toLocaleString()}</div>
      </div>
    </div>
    
  );
}