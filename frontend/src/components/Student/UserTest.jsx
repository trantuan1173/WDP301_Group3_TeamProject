// frontend/src/components/Student/UserTest.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { API_ENDPOINTS } from "../../config";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function UserTestPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [timeFilter, setTimeFilter] = useState("all");

  useEffect(() => {
    const fetchTests = async () => {
      if (!user || !user._id) return;

      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(
          API_ENDPOINTS.GET_TESTS_BY_STUDENT_ID(user._id),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTests(res.data.data);
        // console.log("Tests fetched successfully:", res.data.data);
      } catch (error) {
        console.error("Failed to fetch tests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTests();
  }, [user]);

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">My Test</h2>

      {isLoading ? (
        <LoadingSpinner size={100} />
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            {/* Search box */}
            <div className="flex items-center border rounded px-2 bg-gray-100 w-full max-w-md">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="outline-none py-1 px-2 bg-transparent w-full"
              />
              <FiSearch className="text-gray-600" />
            </div>

            {/* Sort Order Dropdown */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="ml-4 border px-3 py-1 rounded text-sm"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>

            {/* Time Filter Dropdown */}
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="ml-2 border px-3 py-1 rounded text-sm"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-sm text-gray-700">
                <tr>
                  <th className="p-3 border">Day</th>
                  {/* <th className="p-3 border">Tên lớp</th> */}
                  <th className="p-3 border">Course</th>
                  <th className="p-3 border">Test Title</th>
                  <th className="p-3 border">Teacher</th>
                  <th className="p-3 border">Time</th>
                  <th className="p-3 border">Action</th>
                  <th className="p-3 border">Score</th>
                </tr>
              </thead>
              <tbody>
                {tests
                  // .filter(test => new Date(test.dueDate) > new Date())
                  .filter((test) => {
                    const testDate = new Date(test.startDate);
                    const now = new Date();

                    if (timeFilter === "today") {
                      return (
                        testDate.getFullYear() === now.getFullYear() &&
                        testDate.getMonth() === now.getMonth() &&
                        testDate.getDate() === now.getDate()
                      );
                    }

                    if (timeFilter === "thisWeek") {
                      const startOfWeek = new Date(
                        now.setDate(now.getDate() - now.getDay())
                      );
                      const endOfWeek = new Date(startOfWeek);
                      endOfWeek.setDate(endOfWeek.getDate() + 6);
                      return testDate >= startOfWeek && testDate <= endOfWeek;
                    }

                    if (timeFilter === "thisMonth") {
                      return (
                        testDate.getMonth() === now.getMonth() &&
                        testDate.getFullYear() === now.getFullYear()
                      );
                    }

                    return true; // 'all'
                  })

                  .filter((test) => {
                    const query = searchQuery.toLowerCase();
                    const title = test.testId?.title?.toLowerCase() || "";
                    const course =
                      test.courseId?.nameCourses?.toLowerCase() || "";
                    const teacher =
                      test.teacherId?.profileId?.name?.toLowerCase() || "";

                    return (
                      title.includes(query) ||
                      course.includes(query) ||
                      teacher.includes(query)
                    );
                  })

                  .sort((a, b) => {
                    const dateA = new Date(a.startDate);
                    const dateB = new Date(b.startDate);
                    return sortOrder === "newest"
                      ? dateB - dateA
                      : dateA - dateB;
                  })
                  .map((test, idx) => {
                    const start = new Date(test.startDate);
                    const end = new Date(test.dueDate);

                    // Compute duration in minutes
                    const durationMs = end - start;
                    const durationMin = Math.round(durationMs / 60000);

                    const startHour = start
                      .getHours()
                      .toString()
                      .padStart(2, "0");
                    const startMin = start
                      .getMinutes()
                      .toString()
                      .padStart(2, "0");
                    const endHour = end.getHours().toString().padStart(2, "0");
                    const endMin = end.getMinutes().toString().padStart(2, "0");

                    const timeStr = `${durationMin}p (${startHour}h${startMin} - ${endHour}h${endMin})`;

                    // Compute day of the week
                    const daysOfWeek = [
                      "Sunday",
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                    ];
                    const dayName = daysOfWeek[start.getDay()];
                    const dayStr = `${dayName} (${start
                      .getDate()
                      .toString()
                      .padStart(2, "0")}/${(start.getMonth() + 1)
                      .toString()
                      .padStart(2, "0")})`;

                    return (
                      <tr key={test._id} className="text-sm">
                        <td className="p-3 border text-center">{dayStr}</td>
                        {/* <td className="p-3 border">{test.classId?.name}</td> */}
                        <td className="p-3 border">
                          {test.courseId?.nameCourses}
                        </td>
                        <td className="p-3 border">
                          {test.testId?.title || "Untitled"}
                        </td>
                        <td className="p-3 border">
                          {test.teacherId?.profileId?.name}
                        </td>
                        <td className="p-3 border">{timeStr}</td>
                        <td className="p-3 border text-center">
                          <button
                            onClick={() =>
                              navigate(`/user/test/${test.testId._id}`)
                            }
                            title={test.submitted ? "Submitted" : "Do test"}
                            className={`px-3 py-1 text-sm rounded hover:brightness-110 
                          ${
                            test.submitted
                              ? "bg-gray-400 text-white cursor-not-allowed"
                              : test.isExpired
                              ? "bg-red-200 text-red-800 cursor-not-allowed"
                              : "bg-green-200 text-green-800 hover:bg-green-300 cursor-pointer"
                          }`}
                            disabled={test.submitted || test.isExpired}
                          >
                            {test.submitted
                              ? "Submitted"
                              : test.isExpired
                              ? "Expired"
                              : "Do test"}
                          </button>
                        </td>
                        <td className="p-3 border text-center">
                          {test.submitted
                            ? test.score != null
                              ? Number.isInteger(test.score)
                                ? test.score
                                : test.score.toFixed(2)
                              : "Not graded"
                            : "-"}
                        </td>
                      </tr>
                    );
                  })}
                {tests.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      No test available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
