import React from "react";

export default function StudentListTab({ students }) {
  if (!students || students.length === 0) {
    return <div>Không có học viên nào trong lớp này.</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Danh sách học viên</h2>
      <ul className="divide-y">
        {students.map((student, idx) => (
          <li key={student._id} className="py-2 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-500">
              {student.email?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <div className="font-semibold">{student.email}</div>
              <div className="text-xs text-gray-500">ID: {student._id}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}