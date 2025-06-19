import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import ClassInfoTab from "./ClassInfoTab";
import StudentListTab from "./StudentListTab";
import AttendanceTab from "./AttendanceTab";

const TAB = {
  INFO: "INFO",
  STUDENTS: "STUDENTS",
  ATTENDANCE: "ATTENDANCE",
  TEST: "TEST",
};
export default function TeacherClassDetail({ classId, onBack }) {
  const [activeTab, setActiveTab] = useState(TAB.INFO);
  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const resClass = await axios.get(API_ENDPOINTS.GET_CLASS_BY_ID(classId), {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClassInfo(resClass.data.data);
      } catch (err) {
        setClassInfo(null);
      }
      setLoading(false);
    };
    if (classId) fetchData();
  }, [classId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="text-lg font-semibold">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#f6f7fb] min-h-screen">
      {onBack && (
        <button
          className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 font-semibold"
          onClick={onBack}
        >
          ← Quay lại
        </button>
      )}
      <h1 className="text-2xl font-bold mb-6">
        {classInfo?.className || "Tên lớp học"}
      </h1>
      <div className="grid grid-cols-4 gap-6 mb-8">
        <button
          className={`border-2 rounded-lg p-4 font-bold text-lg bg-white transition ${activeTab === TAB.INFO
              ? "border-blue-600 shadow text-blue-700"
              : "border-red-500 text-gray-700"
            }`}
          onClick={() => setActiveTab(TAB.INFO)}
        >
          Progress
        </button>
        <button
          className={`border-2 rounded-lg p-4 font-bold text-lg bg-white transition ${activeTab === TAB.STUDENTS
              ? "border-blue-600 shadow text-blue-700"
              : "border-red-500 text-gray-700"
            }`}
          onClick={() => setActiveTab(TAB.STUDENTS)}
        >
          Danh sách học viên
        </button>
        <button
          className={`border-2 rounded-lg p-4 font-bold text-lg bg-white transition ${activeTab === TAB.ATTENDANCE
              ? "border-blue-600 shadow text-blue-700"
              : "border-red-500 text-gray-700"
            }`}
          onClick={() => setActiveTab(TAB.ATTENDANCE)}
        >
          Điểm danh
        </button>
        <button
          className={`border-2 rounded-lg p-4 font-bold text-lg bg-white transition ${activeTab === TAB.TEST
              ? "border-blue-600 shadow text-blue-700"
              : "border-red-500 text-gray-700"
            }`}
          onClick={() => setActiveTab(TAB.TEST)}
        >
          Bài kiểm tra
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6 min-h-[300px]">
        {activeTab === TAB.INFO && <ClassInfoTab classInfo={classInfo} />}
        {activeTab === TAB.STUDENTS && <StudentListTab students={classInfo?.students || []} />}
        {activeTab === TAB.ATTENDANCE && (
          <AttendanceTab classId={classInfo?._id} students={classInfo?.students || []} />
        )}
        {activeTab === TAB.TEST && <div>Bài kiểm tra (đang phát triển)</div>}
      </div>
    </div>
  );
}