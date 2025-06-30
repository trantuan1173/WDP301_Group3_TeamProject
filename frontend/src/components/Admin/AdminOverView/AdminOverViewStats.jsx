import React from "react";

export default function AdminOverViewStats({ accounts, courses, payments = [] }) {
  const totalStudent = accounts.filter(acc => acc.roleId?.nameRole === "student").length;
  const totalTeacher = accounts.filter(acc => acc.roleId?.nameRole === "teacher").length;
  const totalCourse = courses.length;

  // Calculate current month revenue
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyRevenue = payments
    .filter(
      (p) =>
        p.status === "success" &&
        p.paidAt &&
        new Date(p.paidAt).getMonth() === currentMonth &&
        new Date(p.paidAt).getFullYear() === currentYear
    )
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  // English month name
  const monthName = now.toLocaleString("en-US", { month: "long" });

  return (
    <div className="flex gap-6">
      <div className="bg-white rounded shadow p-6 flex-1 flex flex-col items-center">
        <div className="font-bold text-lg">Total Students</div>
        <div className="text-2xl font-bold">{totalStudent}</div>
      </div>
      <div className="bg-white rounded shadow p-6 flex-1 flex flex-col items-center">
        <div className="font-bold text-lg">Total Teachers</div>
        <div className="text-2xl font-bold">{totalTeacher}</div>
      </div>
      <div className="bg-white rounded shadow p-6 flex-1 flex flex-col items-center">
        <div className="font-bold text-lg">Courses Open</div>
        <div className="text-2xl font-bold">{totalCourse}</div>
      </div>
      <div className="bg-white rounded shadow p-6 flex-1 flex flex-col items-center">
        <div className="font-bold text-lg">
          Revenue ({monthName} {currentYear})
        </div>
        <div className="text-2xl font-bold text-green-700">
          ₫{monthlyRevenue.toLocaleString("en-US")}
        </div>
      </div>
    </div>
  );
}