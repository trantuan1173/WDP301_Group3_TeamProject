import { useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import AdminAddAccount from "./AdminAddAccountForm";
import AdminEditAccount from "./AdminEditAccountForm";
import AdminViewAccount from "./AdminViewAccountForm";
import axios from "axios";
import { useEffect } from "react";
import { API_ENDPOINTS } from "../../../config";
import LoadingSpinner from "../../LoadingSpinner";

export default function AdminManageAccount() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(null);
  const [showViewForm, setShowViewForm] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);


  const handleAddUser = async (newUser) => {
  const token = localStorage.getItem("token");
  const endpoint =
    newUser.role === "teacher"
      ? API_ENDPOINTS.REGISTER_TEACHER
      : API_ENDPOINTS.REGISTER;

  try {
    const response = await axios.post(endpoint, newUser, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200 || response.status === 201) {
      alert("Tạo tài khoản thành công");
      setShowAddForm(false);
      fetchUsers(); // refresh danh sách từ API
    }
  } catch (error) {
    console.error("Lỗi khi tạo tài khoản:", error);
    alert("Tạo tài khoản thất bại");
  }
};

  const handleUpdateUser = async (updatedUser) => {
  try {
    const token = localStorage.getItem("token");

    const payload = {
      email: updatedUser.email,
      roleId: updatedUser.role,
      profileData: {
        name: updatedUser.profile.name,
        dob: updatedUser.profile.dob,
        gender: updatedUser.profile.gender,
        phone: updatedUser.profile.phone,
        address: updatedUser.profile.address || "",
        imageURL: updatedUser.profile.imageURL || ""
      },
    };
    
    const response = await axios.put(
      `${API_ENDPOINTS.ADMIN_UPDATE_USER.replace(":userId", updatedUser._id)}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      alert("Cập nhật người dùng thành công");
      setShowEditForm(null);
      fetchUsers(); // Làm mới danh sách
    }
  } catch (error) {
    console.error("Lỗi cập nhật người dùng:", error);
    alert("Cập nhật người dùng thất bại");
  }
};



  const handleDeleteUser = async (id) => {
  if (window.confirm("Bạn có chắc muốn xoá tài khoản này?")) {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(API_ENDPOINTS.DELETE_USER.replace(":userId", id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Xóa tài khoản thành công");
      fetchUsers(); // Làm mới danh sách
    } catch (error) {
      console.error("Lỗi khi xóa tài khoản:", error);
      alert("Xóa tài khoản thất bại");
    }
  }
};

  // Chỉ đếm giáo viên và học viên
  const totalTeachers = users.filter((u) => u.role.nameRole.toLowerCase() === "teacher").length;
  const totalStudents = users.filter((u) => u.role.nameRole.toLowerCase() === "student").length;
  const totalUsers = totalTeachers + totalStudents;

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.GET_ALL_ACCOUNT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const mappedUsers = response.data.data.map((item, index) => ({
          id: item._id,
          name: item.profileId?.name || "",
          email: item.email,
          gender: item.profileId?.gender || "",
          dob: item.profileId?.dob ? item.profileId.dob.slice(0, 10) : "",
          phone: item.profileId?.phone || "",
          address: item.profileId?.address || "",
          imageURL: item.profileId?.imageURL || "",
          role: {
            _id: item.roleId?._id || "",
            nameRole: item.roleId?.nameRole || ""
          }
        }));
        setUsers(mappedUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.GET_ALL_ROLE, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const mappedRoles = response.data.data.map((item, index) => item);
        setRoles(mappedRoles);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);
  // Lọc theo search và role
  const filteredUsers = users.filter((user) => {
    const keyword = searchQuery.toLowerCase().trim();
    const name = user.name?.toLowerCase() || "";
    const email = user.email?.toLowerCase() || "";
    const matchesSearch = name.includes(keyword) || email.includes(keyword);
    const matchesRole = selectedRole === "All" || user.role.nameRole.toLowerCase() === selectedRole.toLowerCase();
    return matchesSearch && matchesRole;
  });
  if (loading) return <LoadingSpinner size={120} text="Loading..." />;

  // Danh sách roles cho dropdown chỉnh sửa

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
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
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
          roles={roles}
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
                <td className="px-4 py-2">{user.role.nameRole}</td>
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
