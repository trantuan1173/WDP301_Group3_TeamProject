import React, { useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import { FaUserEdit } from "react-icons/fa";
const statusOptions = [
    { value: "pending", label: "Not Process" },
    { value: "processing", label: "Processing" },
    { value: "processed", label: "Processed" },
];

export default function AdminEditCustomerConsulting({ consulting, onClose, onSuccess }) {
    const [note, setNote] = useState(consulting.note || "");
    const [status, setStatus] = useState(consulting.status || "pending");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                API_ENDPOINTS.EDIT_CUSTOMER_CONSULTING(consulting._id),
                { note, status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (onSuccess) onSuccess();
        } catch (err) {
            alert("Update failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={onClose} >
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl  relative " onClick={(e) => e.stopPropagation()}>
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
                    onClick={onClose}
                >
                    ×
                </button>
                <div className="flex justify-center items-center gap-2 mb-4">
                    <FaUserEdit className="text-blue-600 text-2xl" />
                    <h2 className="text-xl font-bold text-center">Update Customer Consulting</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium mb-1">Name</label>
                        <input
                            className="border rounded px-3 py-2 w-full bg-gray-100"
                            value={consulting.name}
                            disabled
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Email</label>
                        <input
                            className="border rounded px-3 py-2 w-full bg-gray-100"
                            value={consulting.email}
                            disabled
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Phone</label>
                        <input
                            className="border rounded px-3 py-2 w-full bg-gray-100"
                            value={consulting.phone}
                            disabled
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Content</label>
                        <textarea
                            className="border rounded px-3 py-2 w-full bg-gray-100"
                            value={consulting.content}
                            disabled
                            readOnly
                            rows={2}
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Note</label>
                        <textarea
                            className="border rounded px-3 py-2 w-full"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={3}
                            placeholder="Enter note..."
                        />
                    </div>
                    <div>
                        <label className="block font-medium mb-1">Status</label>
                        <select
                            className="border rounded px-3 py-2 w-full"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            disabled={consulting.status === "processed"}
                        >

                            {statusOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}