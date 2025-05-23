import { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import AdminAddAccount from "./AdminAddAccountForm";
import AdminEditAccount from "./AdminEditAccountForm";
import AdminViewAccount from "./AdminViewAccountForm";
import axios from "axios";
import { useEffect } from "react";
import { API_ENDPOINTS } from "../../../config";

export default function AdminManageAccount() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(null);
  const [showViewForm, setShowViewForm] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");


  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Bui Hang",
      email: "hangbui@gmail.com",
      gender: "Nu",
      dob: "2002-02-20",
      phone: "0987654321",
      role: "Manager",
      password: "123456",
    },
    {
      id: 2,
      name: "Jony",
      email: "jony112@gmail.com",
      gender: "Nam",
      dob: "2003-11-11",
      phone: "0987654321",
      role: "Teacher",
      password: "abcdef",
    },
    {
      id: 3,
      name: "Mai Mai",
      email: "maimai@gmail.com",
      gender: "Nu",
      dob: "2005-03-22",
      phone: "0987654321",
      role: "Student",
      password: "maimai123",
    },
    {
      id: 4,
      name: "Trang Ma",
      email: "maitrang@gmail.com",
      gender: "Nu",
      dob: "2005-03-22",
      phone: "0987654421",
      role: "Student",
      password: "maimai123",
    },
  ]);

  const handleAddUser = (newUser) => {
    setUsers([...users, { ...newUser, id: users.length + 1 }]);
    setShowAddForm(false);
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setShowEditForm(null);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Bạn có chắc muốn xoá tài khoản này?")) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  // Chỉ đếm giáo viên và học viên
  const totalTeachers = users.filter((u) => u.role === "Teacher").length;
  const totalStudents = users.filter((u) => u.role === "Student").length;
  const totalUsers = totalTeachers + totalStudents;

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(API_ENDPOINTS.GET_ALL_ACCOUNT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []); 
  // Lọc theo search và role
  const filteredUsers = users.filter((user) => {
    const keyword = searchQuery.toLowerCase().trim();
    const name = user.name || "";
    const email = user.email || "";
    const matchesSearch =
      name.toLowerCase().includes(keyword) ||
      email.toLowerCase().includes(keyword);
    const matchesRole = selectedRole === "All" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">QUẢN LÝ TÀI KHOẢN</h2>

      {/* Cards thống kê */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#00224D] text-white p-4 rounded-lg text-center font-semibold shadow">
          Tổng người dùng: {totalUsers}
        </div>
        <div className="bg-[#00224D] text-white p-4 rounded-lg text-center font-semibold shadow">
          Tổng giáo viên: {totalTeachers}
        </div>
        <div className="bg-[#00224D] text-white p-4 rounded-lg text-center font-semibold shadow">
          Tổng học viên: {totalStudents}
        </div>
      </div>

      {/* Search + Filter + Thêm */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Danh sách</span>
          <div className="flex border rounded px-2 items-center">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="outline-none py-1 px-2 bg-transparent"
            />
            <FiSearch className="text-gray-600" />
          </div>
        </div>

        <div className="flex gap-2">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border px-3 py-1 rounded bg-white text-sm"
          >
            <option value="All">All</option>
            <option value="Teacher">Teacher</option>
            <option value="Student">Student</option>
            <option value="Manager">Manager</option>
          </select>
          <button className="bg-blue-100 text-blue-800 px-4 py-1 rounded shadow text-sm font-medium">
            Xuất dữ liệu
          </button>
          <button
            className="bg-indigo-600 text-white flex items-center gap-2 px-3 py-1 rounded shadow text-sm font-medium"
            onClick={() => setShowAddForm(true)}
          >
            <FaPlus /> Tạo tài khoản
          </button>
        </div>
      </div>

      {/* Form Thêm/Chỉnh sửa/Xem */}
      {showAddForm && (
        <AdminAddAccount
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddUser}
        />
      )}
      {showViewForm && (
        <AdminViewAccount
          user={showViewForm}
          onClose={() => setShowViewForm(null)}
        />
      )}
      {showEditForm && (
        <AdminEditAccount
          user={showEditForm}
          onClose={() => setShowEditForm(null)}
          onSubmit={handleUpdateUser}
        />
      )}

      {/* Table danh sách người dùng */}
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
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-2">{user.id}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.gender}</td>
                <td className="px-4 py-2">{user.dob}</td>
                <td className="px-4 py-2">{user.phone}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2 flex gap-2">
                  <FaEye
                    className="text-green-600 cursor-pointer"
                    onClick={() => setShowViewForm(user)}
                  />
                  <FaEdit
                    className="text-blue-600 cursor-pointer"
                    onClick={() => setShowEditForm(user)}
                  />
                  <FaTrash
                    className="text-red-600 cursor-pointer"
                    onClick={() => handleDeleteUser(user.id)}
                  />
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-4 text-gray-500 italic"
                >
                  Không tìm thấy người dùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
