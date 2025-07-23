// frontend/src/components/Teacher/TeacherMangeClass/ScoreTab.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport } from "@fortawesome/free-solid-svg-icons";
import ViewStudentsScoreModal from "../teacherModal/ViewStudentsScoreModal";
import LoadingSpinner from "../../LoadingSpinner";

const ScoreTab = ({ classId }) => {
  const [assignData, setAssignData] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterTime, setFilterTime] = useState("this");
  const [selectedTestAssignId, setSelectedTestAssignId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchAssigns = async () => {
      if (!classId) return;
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(API_ENDPOINTS.GET_TEST_ASSIGN_BY_CLASS(classId), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssignData(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch assigns", err);
        setAssignData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAssigns();
  }, [classId]);


  const getStatus = (startDate, dueDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const due = new Date(dueDate);
    if (now < start) return { text: "Chưa bắt đầu", color: "#dc2626" };
    if (now > due) return { text: "Đã kết thúc", color: "#a16207" };
    return { text: "Đang diễn ra", color: "#16a34a" };
  };

  const getTimeRange = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diffToMonday));
    monday.setHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    return { monday, sunday };
  };

  const filteredData = assignData.filter((assign) => {
    const title = assign.testId?.title || assign.title || "";
    const matchName = title.toLowerCase().includes(filterName.toLowerCase());

    const { monday, sunday } = getTimeRange();
    const startDate = new Date(assign.startDate);

    let matchTime = true;
    if (filterTime === "this") matchTime = startDate >= monday && startDate <= sunday;
    else if (filterTime === "past") matchTime = startDate < monday;
    else if (filterTime === "future") matchTime = startDate > sunday;

    return matchName && matchTime;
  });

  const handleOpenScoreModal = (testAssignId) => {
    setSelectedTestAssignId(testAssignId);
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-[#111827]">Assigned Tests</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="px-4 py-2 rounded-lg border border-[#ccc] shadow w-full md:w-1/2"
        />
        <select
          value={filterTime}
          onChange={(e) => setFilterTime(e.target.value)}
          className="px-4 py-2 rounded-lg border border-[#ccc] shadow w-full md:w-1/4"
        >
          <option value="">-- All time --</option>
          <option value="past">Past</option>
          <option value="this">This week</option>
          <option value="future">Future</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-2 px-4 text-left">No</th>
              <th className="py-2 px-4 text-left">Test name</th>
              <th className="py-2 px-4 text-left">Due date</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">View score</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 && !loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  No tests assigned
                </td>
              </tr>
            ) : (
              filteredData.map((assign, idx) => {
                const status = getStatus(assign.startDate, assign.dueDate);
                return (
                  <tr key={assign._id} className="border-b border-gray-200">
                    <td className="py-2 px-4">{idx + 1}</td>
                    <td className="py-2 px-4 font-semibold">{assign.testId?.title || assign.title}</td>
                    <td className="py-2 px-4">{new Date(assign.dueDate).toLocaleString("vi-VN")}</td>
                    <td className="py-2 px-4 font-semibold" style={{ color: status.color }}>
                      {status.text}
                    </td>
                    <td className="py-2 px-4">
                      <button
                        className="p-1 text-blue-600 hover:text-blue-900"
                        onClick={() => handleOpenScoreModal(assign._id)}
                      >
                        <FontAwesomeIcon icon={faFileExport} /> View score
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

        </table>
        {loading && (
          <div className="flex justify-center mt-6">
            <LoadingSpinner />
          </div>
        )}

      </div>

      {/* Modal for viewing scores */}
      <ViewStudentsScoreModal
        show={showModal}
        onClose={() => setShowModal(false)}
        testAssignId={selectedTestAssignId}
      />
    </div>
  );
};

export default ScoreTab;
