import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";

export default function AdminAddTeacherClassForm({ classId, onSuccess, onCancel }) {
  const [teachers, setTeachers] = useState([]);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch teacher list on open
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(API_ENDPOINTS.GET_ALL_TEACHER, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeachers(res.data.data || res.data);
      } catch (err) {
        setError("Failed to fetch teacher list.");
      }
    };
    fetchTeachers();
  }, []);

  // Filter teachers by email or name
  useEffect(() => {
    if (!query) {
      setFiltered([]);
      return;
    }
    setFiltered(
      teachers.filter(
        t =>
          t.email.toLowerCase().includes(query.toLowerCase()) ||
          t.profileId?.name?.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query, teachers]);

  const handleSelect = (teacher) => {
    setSelectedTeacher(teacher);
    setQuery(teacher.email);
    setFiltered([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTeacher) {
      setError("Please select a teacher from the suggestion list.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        API_ENDPOINTS.UPDATE_CLASS(classId),
        { teacherId: selectedTeacher._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (onSuccess) onSuccess();
    } catch (err) {
      if (err?.response?.status === 409) {
        setError("This teacher has a schedule conflict. Please assign another teacher.");
      } else {
        setError("Failed to update teacher.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={onCancel}>
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4 text-center">Assign Teacher to Class</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-3 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block mb-1 font-medium">Search teacher (email or name)</label>
            <input
              type="text"
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setSelectedTeacher(null);
              }}
              className="w-full bg-blue-100 p-2 rounded"
              placeholder="Enter teacher's email or name"
              autoComplete="off"
              onFocus={() => {
  if (!query) {
    setFiltered(teachers);
  } else {
    setFiltered(
      teachers.filter(
        t =>
          t.email.toLowerCase().includes(query.toLowerCase()) ||
          t.profileId?.name?.toLowerCase().includes(query.toLowerCase())
      )
    );
  }
}}

            />
            {filtered.length > 0 && (
              <ul className="absolute z-10 bg-white border rounded shadow max-h-40 overflow-auto w-full mt-1">
                {filtered.map(t => (
                  <li
                    key={t._id}
                    className="px-3 py-1 hover:bg-blue-100 cursor-pointer"
                    onClick={() => handleSelect(t)}
                  >
                    {t.profileId?.name} - {t.email}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-900 text-white px-6 py-2 rounded hover:bg-indigo-800"
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