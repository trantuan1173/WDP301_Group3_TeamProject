import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { API_ENDPOINTS } from "../../config";

export default function UserTestPage() {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTests = async () => {
      if (!user || !user._id) return;

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          API_ENDPOINTS.GET_TESTS_BY_STUDENT_ID(user._id),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTests(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch tests:", error);
      }
    };

    fetchTests();
  }, [user]);

  const filteredTests = tests.filter((test) =>
    test.classId?.course?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Bài Kiểm Tra Của Tôi</h2>

      <div className="flex items-center justify-between mb-4">
        {/* Search box */}
        <div className="flex items-center border rounded px-2 bg-gray-100 w-full max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm lớp học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="outline-none py-1 px-2 bg-transparent w-full"
          />
          <FiSearch className="text-gray-600" />
        </div>

        {/* Tuần dropdown (placeholder) */}
        <select className="ml-4 border px-3 py-1 rounded text-sm">
          <option>Tuần này</option>
          <option>Tuần trước</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-sm text-gray-700">
            <tr>
              <th className="p-3 border">Thứ</th>
              <th className="p-3 border">Tên lớp</th>
              <th className="p-3 border">Khoá học</th>
              <th className="p-3 border">Giáo viên</th>
              <th className="p-3 border">Thời gian</th>
              <th className="p-3 border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredTests.map((test, idx) => {
              const day = new Date(test.dueDate).getDay(); // 0 = Sunday
              const startHour = new Date(test.dueDate).getHours();
              const startMin = new Date(test.dueDate).getMinutes();
              const endHour = startHour + 1;
              const timeStr = `45p (${startHour}h${startMin} - ${endHour}h${startMin})`;

              return (
                <tr key={test._id} className="text-sm">
                  <td className="p-3 border text-center">{day}</td>
                  <td className="p-3 border">{test.classId?.name}</td>
                  <td className="p-3 border">{test.courseId?.nameCourses}</td>
                  <td className="p-3 border">{test.teacherId?.name}</td>
                  <td className="p-3 border">{timeStr}</td>
                  <td className="p-3 border text-center">
                    <button className="bg-green-200 text-green-800 px-3 py-1 rounded text-sm hover:bg-green-300">
                      Làm bài
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredTests.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Không có bài kiểm tra.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
