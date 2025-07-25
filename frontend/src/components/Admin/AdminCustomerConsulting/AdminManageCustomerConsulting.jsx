import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import LoadingSpinner from "../../LoadingSpinner";
import AdminEditCustomerConsulting from "./AdminEditCustomerConsulting";

export default function AdminManageCustomerConsulting() {
  const [customerConsulting, setCustomerConsulting] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingConsulting, setEditingConsulting] = useState(null);
  const [refresh, setRefresh] = useState(false);

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
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerConsulting();
  }, [refresh]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = customerConsulting.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(customerConsulting.length / usersPerPage);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this consulting?")) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(API_ENDPOINTS.DELETE_CUSTOMER_CONSULTING(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRefresh(r => !r);
    } catch (err) {
      alert("Delete failed!");
    } finally {
      setLoading(false);
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
            Not Process
          </span>
        );
      case "processing":
        return (
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
            Processing
          </span>
        );
      case "processed":
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
            Processed
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
            Unknown
          </span>
        );
    }
  };

  if (loading) return <LoadingSpinner size={120} text="Loading..." />;

  return (
    <div className="p-6 bg-white-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">CUSTOMER CONSULTING</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#00224D] text-white p-4 rounded-lg text-center font-semibold shadow">
          Total Customer Consulting: {customerConsulting.length}
        </div>
      </div>

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
              <th className="px-4 py-2">Note</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentUsers.map((user, idx) => (
              <tr key={user._id}>
                <td className="px-4 py-2">{indexOfFirstUser + idx + 1}</td>
                <td className="px-4 py-2">{user.name || "No name"}</td>
                <td className="px-4 py-2">{user.email || "No email"}</td>
                <td className="px-4 py-2">{user.phone || "No phone"}</td>
                <td className="px-4 py-2">{user.content || "No content"}</td>
                <td className="px-4 py-2">{renderStatus(user.status)}</td>
                <td className="px-4 py-2">{user.note || "No comment"}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                    title="Edit"
                    onClick={() => setEditingConsulting(user)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                    title="Delete"
                    onClick={() => handleDelete(user._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {currentUsers.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500 italic">
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
            className="px-3 py-1 rounded bg-blue-500 text-white font-medium hover:bg-blue-600"
          >
            Prev
          </button>
        )}
        {currentPage < totalPages && (
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-3 py-1 rounded bg-blue-500 text-white font-medium hover:bg-blue-600"
          >
            Next
          </button>
        )}
        <span className="ml-3 text-sm text-gray-600 self-center">
          Page {currentPage} / {totalPages}
        </span>
      </div>

      {editingConsulting && (
        <AdminEditCustomerConsulting
          consulting={editingConsulting}
          onClose={() => setEditingConsulting(null)}
          onSuccess={() => {
            setEditingConsulting(null);
            setRefresh((r) => !r);
          }}
        />
      )}
    </div>
  );
}
