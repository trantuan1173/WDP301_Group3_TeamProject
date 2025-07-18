import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import AdminAddAccount from "./AdminAddAccountForm";
import AdminEditAccount from "./AdminEditAccountForm";
import AdminViewAccount from "./AdminViewAccountForm";
import axios from "axios";
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
  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 15;

  // State for column visibility
  const [showColumns, setShowColumns] = useState({
    id: false,
    gender: false,
    dob: false,
    phone: false,
  });

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
        alert("Account created successfully");
        setShowAddForm(false);
        fetchUsers();
      }
    } catch (error) {
      console.error("Error creating account:", error);
      alert("Failed to create account");
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
          imageURL: updatedUser.profile.imageURL || "",
        },
      };

      const response = await axios.put(
        API_ENDPOINTS.ADMIN_UPDATE_USER.replace(":userId", updatedUser._id),
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("User updated successfully");
        setShowEditForm(null);
        fetchUsers();
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user");
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(API_ENDPOINTS.DELETE_USER.replace(":userId", id), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Account deleted successfully");
        fetchUsers();
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account");
      }
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.GET_ALL_ACCOUNT, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const mappedUsers = response.data.data.map((item) => ({
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
            nameRole: item.roleId?.nameRole || "",
          },
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
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setRoles(response.data.data);
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

  const filteredUsers = users.filter((user) => {
    const keyword = searchQuery.toLowerCase().trim();
    const matchesSearch =
      user.name.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword);
    const matchesRole =
      selectedRole === "All" ||
      user.role.nameRole.toLowerCase() === selectedRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const totalTeachers = users.filter(
    (u) => u.role.nameRole.toLowerCase() === "teacher"
  ).length;
  const totalStudents = users.filter(
    (u) => u.role.nameRole.toLowerCase() === "student"
  ).length;
  const totalUsers = totalTeachers + totalStudents;

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (loading) return <LoadingSpinner size={120} text="Loading..." />;

  return (
    <div className="p-6 bg-white-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">ACCOUNT MANAGEMENT</h2>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#00224D] text-white p-4 rounded-lg text-center font-semibold shadow">
          Total users: {totalUsers}
        </div>
        <div className="bg-[#00224D] text-white p-4 rounded-lg text-center font-semibold shadow">
          Total teachers: {totalTeachers}
        </div>
        <div className="bg-[#00224D] text-white p-4 rounded-lg text-center font-semibold shadow">
          Total students: {totalStudents}
        </div>
      </div>

      {/* Search + Filter + Add + Show Columns */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold">List</span>
          <div className="flex border rounded px-2 items-center">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="outline-none py-1 px-2 bg-transparent"
            />
            <FiSearch className="text-gray-600" />
          </div>
          {/* Column checkboxes */}
          <div className="flex flex-wrap gap-2 ml-4">
            <label className="flex items-center gap-1 text-sm whitespace-nowrap">
              <input
                type="checkbox"
                checked={showColumns.id}
                onChange={() =>
                  setShowColumns((prev) => ({ ...prev, id: !prev.id }))
                }
              />{" "}
              UserID
            </label>
            <label className="flex items-center gap-1 text-sm whitespace-nowrap">
              <input
                type="checkbox"
                checked={showColumns.gender}
                onChange={() =>
                  setShowColumns((prev) => ({ ...prev, gender: !prev.gender }))
                }
              />{" "}
              Gender
            </label>
            <label className="flex items-center gap-1 text-sm whitespace-nowrap">
              <input
                type="checkbox"
                checked={showColumns.dob}
                onChange={() =>
                  setShowColumns((prev) => ({ ...prev, dob: !prev.dob }))
                }
              />{" "}
              Date of Birth
            </label>
            <label className="flex items-center gap-1 text-sm whitespace-nowrap">
              <input
                type="checkbox"
                checked={showColumns.phone}
                onChange={() =>
                  setShowColumns((prev) => ({ ...prev, phone: !prev.phone }))
                }
              />{" "}
              Phone
            </label>
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
            Export Data
          </button>
          <button
            className="bg-indigo-600 text-white flex items-center gap-2 px-3 py-1 rounded shadow text-sm font-medium"
            onClick={() => setShowAddForm(true)}
          >
            <FaPlus /> Create Account
          </button>
        </div>
      </div>

      {/* Forms */}
      {showAddForm && (
        <AdminAddAccount
          onClose={() => setShowAddForm(false)}
          onSubmit={handleAddUser}
        />
      )}
      {showViewForm && (
        <AdminViewAccount user={showViewForm} onClose={() => setShowViewForm(null)} />
      )}
      {showEditForm && (
        <AdminEditAccount
          user={showEditForm}
          roles={roles}
          onClose={() => setShowEditForm(null)}
          onSubmit={handleUpdateUser}
        />
      )}

      {/* User Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full table-auto text-sm text-left">
          <thead className="bg-gray-200 font-semibold">
            <tr>
              <th className="px-4 py-2">No.</th>
              {showColumns.id && <th className="px-4 py-2">UserID</th>}
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              {showColumns.gender && <th className="px-4 py-2">Gender</th>}
              {showColumns.dob && <th className="px-4 py-2">Date of Birth</th>}
              {showColumns.phone && <th className="px-4 py-2">Phone</th>}
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentUsers.map((user, idx) => (
              <tr key={user.id}>
                <td className="px-4 py-2">{indexOfFirstUser + idx + 1}</td>
                {showColumns.id && (
                  <td className="px-4 py-2 text-xs break-all">{user.id}</td>
                )}
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                {showColumns.gender && <td className="px-4 py-2">{user.gender}</td>}
                {showColumns.dob && <td className="px-4 py-2">{user.dob}</td>}
                {showColumns.phone && <td className="px-4 py-2">{user.phone}</td>}
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
            {currentUsers.length === 0 && (
              <tr>
                <td colSpan={showColumns.id ? 9 : 8} className="text-center py-4 text-gray-500 italic">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-4 gap-2">
        {/* Ẩn Prev nếu ở trang đầu */}
        {currentPage > 1 && (
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 rounded bg-blue-500 text-white font-medium"
          >
            Prev
          </button>
        )}
        {/* Hiện Next nếu chưa phải trang cuối */}
        {currentPage < totalPages && (
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-3 py-1 rounded bg-blue-500 text-white font-medium"
          >
            Next
          </button>
        )}
        <span className="ml-3 text-sm text-gray-600 self-center">
          Page {currentPage} / {totalPages}
        </span>
      </div>
    </div>
  );
}