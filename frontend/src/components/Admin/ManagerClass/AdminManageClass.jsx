import React, { useState } from "react";

const mockData = [
  {
    _id: "1",
    course: "Tiếng Anh Thiếu nhi 1",
    className: "Lớp A1",
    teacherId: "t1",
    teacherName: "Cô Lan",
    students: Array(10).fill({}),
    progress: 80,
    start_time: "2025-08-01T00:00:00.000Z",
    status: "Đang diễn ra"
  },
  {
    _id: "2",
    course: "Giao tiếp cơ bản",
    className: "Lớp GCB2",
    teacherId: "t2",
    teacherName: "Thầy Hùng",
    students: Array(15).fill({}),
    progress: 100,
    start_time: "2025-08-01T00:00:00.000Z",
    status: "Đang diễn ra"
  },
  {
    _id: "3",
    course: "Tiếng Anh Thiếu nhi 1",
    className: "Lớp A2",
    teacherId: null,
    teacherName: "",
    students: [],
    progress: 0,
    start_time: "2025-09-01T00:00:00.000Z",
    status: "Chưa bắt đầu"
  }
];

const getMonthYear = (dateStr) => {
  const d = new Date(dateStr);
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

const getStatusColor = (status) => {
  if (status === "Đang diễn ra") return "text-green-600";
  if (status === "Chưa bắt đầu") return "text-red-500";
  if (status === "Đã hoàn thành") return "text-orange-500";
  return "text-gray-800";
};

const AdminManageClass = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="bg-white min-h-screen p-8">
      <h2 className="font-extrabold text-2xl mb-8 tracking-wide">QUẢN LÝ LỚP HỌC</h2>
      
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm lớp, giáo viên, khóa học..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full py-2.5 pl-4 pr-10 border border-gray-300 rounded-full text-base bg-gray-50 outline-none"
          />
          <span className="absolute right-3 top-3 text-gray-400">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
        </div>
        <button className="bg-blue-100 text-gray-800 rounded-full px-5 py-2 font-semibold shadow-sm">Filter thời gian</button>
        <button className="bg-blue-100 text-gray-800 rounded-full px-5 py-2 font-semibold shadow-sm">Filter trạng thái</button>
        <button className="bg-white text-gray-800 rounded-full px-5 py-2 font-bold shadow-sm flex items-center gap-1 border border-gray-200">
          <span className="text-xl font-bold">+</span> Thêm lớp học
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-auto">
        <table className="w-full text-base">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-2">ID</th>
              <th className="text-left py-3 px-2">Tên lớp</th>
              <th className="text-left py-3 px-2">Khóa học</th>
              <th className="text-left py-3 px-2">Tháng mở</th>
              <th className="text-left py-3 px-2">Giáo viên phụ trách</th>
              <th className="text-left py-3 px-2">Số học sinh</th>
              <th className="text-left py-3 px-2">Tiến độ (%)</th>
              <th className="text-left py-3 px-2">Trạng thái lớp</th>
              <th className="text-left py-3 px-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {mockData
              .filter(row =>
                row.course.toLowerCase().includes(search.toLowerCase()) ||
                row.className.toLowerCase().includes(search.toLowerCase()) ||
                (row.teacherName || "").toLowerCase().includes(search.toLowerCase())
              )
              .map((row, idx) => (
                <tr key={row._id} className="border-b border-gray-100">
                  <td className="py-2 px-2">{idx + 1}</td>
                  <td className="py-2 px-2">{row.className}</td>
                  <td className="py-2 px-2">{row.course}</td>
                  <td className="py-2 px-2">{getMonthYear(row.start_time)}</td>
                  <td className={`py-2 px-2 ${row.teacherId ? "text-gray-800" : "text-red-500 font-bold"}`}>
                    {row.teacherId ? row.teacherName : "Chưa có giáo viên"}
                  </td>
                  <td className="py-2 px-2">{row.students.length}/15</td>
                  <td className="py-2 px-2">{row.progress}%</td>
                  <td className={`py-2 px-2 font-bold ${getStatusColor(row.status)}`}>
                    {row.status}
                  </td>
                  <td className="py-2 px-2">
                    <button className="bg-gray-200 rounded-full px-4 py-1 font-semibold text-base">Chi tiết</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminManageClass;
