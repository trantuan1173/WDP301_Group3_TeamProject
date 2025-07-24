import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaEye } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import LoadingSpinner from "../../LoadingSpinner";

export default function AdminManageCustomerConsulting() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerConsulting, setCustomerConsulting] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const usersPerPage = 15;

useEffect(() => {
  const fetchCustomerConsulting = async () => {
    try {
      const token = localStorage.getItem("token");
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.GET_ALL_CUSTOMER_CONSULTING, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setCustomerConsulting(response.data);
        console.log(customerConsulting);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchCustomerConsulting();
}, []);


  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = customerConsulting.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(customerConsulting.length / usersPerPage);

  if (loading) return <LoadingSpinner size={120} text="Loading..." />;

  return (
    <div className="p-6 bg-white-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">CUSTOMER CONSULTING</h2>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#00224D] text-white p-4 rounded-lg text-center font-semibold shadow">
          Total Customer Consulting: {customerConsulting.length}
        </div>
      </div>

      {/* Search + Filter + Add + Show Columns */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold">List</span>
          {/* Column checkboxes */}
        </div>

        <div className="flex gap-2">
          <button
            className="bg-indigo-600 text-white flex items-center gap-2 px-3 py-1 rounded shadow text-sm font-medium"
            onClick={() => setCustomerConsulting(true)}
          >
            <FaPlus /> Create Account
          </button>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full table-auto text-sm text-left">
          <thead className="bg-gray-200 font-semibold">
            <tr>
              <th className="px-4 py-2">No.</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Content</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentUsers.map((user, idx) => (
              <tr key={user.id}>
                <td className="px-4 py-2">{indexOfFirstUser + idx + 1}</td>
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.phone}</td>
                <td className="px-4 py-2">{user.content}</td>
                <td className="px-4 py-2">{user.status}</td>
                <td className="px-4 py-2 flex gap-2">
                  <FaEye
                    className="text-green-600 cursor-pointer"
                    onClick={() => setCustomerConsulting(user)}
                  />
                  <FaEdit
                    className="text-blue-600 cursor-pointer"
                    onClick={() => setCustomerConsulting(user)}
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
                <td colSpan={6} className="text-center py-4 text-gray-500 italic">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4 gap-2">
        {currentPage > 1 && (
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 rounded bg-blue-500 text-white font-medium"
          >
            Prev
          </button>
        )}
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