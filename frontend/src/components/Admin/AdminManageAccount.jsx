// src/components/Admin/AdminManageAccount.js
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

export default function AdminManageAccount() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">QUAN LY TAI KHOAN</h2>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {["Tong nguoi dung", "Tong giao vien", "Tong hoc vien"].map((label, i) => (
          <div key={i} className="bg-[#00224D] text-white p-4 rounded-lg text-center font-semibold shadow">
            {label}
          </div>
        ))}
      </div>

      {/* Search + Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Danh sách</span>
          <div className="flex border rounded px-2 items-center">
            <input type="text" placeholder="Tìm kiếm..." className="outline-none py-1 px-2 bg-transparent" />
            <FiSearch className="text-gray-600" />
          </div>
        </div>

        <div className="flex gap-2">
          <select className="border px-3 py-1 rounded bg-white text-sm">
            <option>All</option>
            <option>Teacher</option>
            <option>Student</option>
          </select>
          <button className="bg-blue-100 text-blue-800 px-4 py-1 rounded shadow text-sm font-medium">
            Xuất dữ liệu
          </button>
          <button className="bg-indigo-600 text-white flex items-center gap-2 px-3 py-1 rounded shadow text-sm font-medium">
            <FaPlus /> Tạo tài khoản
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full table-auto text-sm text-left">
          <thead className="bg-gray-200 font-semibold">
            <tr>
              <th className="px-4 py-2">Id</th>
              <th className="px-4 py-2">Tên</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Giới tính</th>
              <th className="px-4 py-2">Ngày sinh</th>
              <th className="px-4 py-2">SĐT</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {[
              {
                id: 1,
                name: "Bui Hang",
                email: "hangbui@gmail.com",
                gender: "Nu",
                dob: "20/02/2002",
                phone: "0987654321",
                role: "Manager",
              },
              {
                id: 2,
                name: "Jony",
                email: "jony112@gmail.com",
                gender: "Nam",
                dob: "11/11/2003",
                phone: "0987654321",
                role: "Teacher",
              },
              {
                id: 3,
                name: "Mai Mai",
                email: "maimai@gmail.com",
                gender: "Nu",
                dob: "03/22/2005",
                phone: "0987654321",
                role: "Student",
              },
            ].map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-2">{user.id}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.gender}</td>
                <td className="px-4 py-2">{user.dob}</td>
                <td className="px-4 py-2">{user.phone}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2 flex gap-2">
                  <FaEdit className="text-blue-600 cursor-pointer" />
                  <FaTrash className="text-red-600 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
