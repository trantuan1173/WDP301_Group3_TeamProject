import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import ClassInfoTab from "./ClassInfoTab";
import StudentListTab from "./StudentListTab";
import AttendanceTab from "./AttendanceTab";
import TestTab from "./TestTab";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faUserCheck, faFileAlt } from "@fortawesome/free-solid-svg-icons";

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

      {/* Tabs */}
<div className="flex justify-between gap-6 mb-8 max-w-5xl mx-auto items-end">
  {[
    {
      title: "Progress",
      icon: faChartLine,
      color: "from-blue-400 to-blue-600",
      tab: TAB.INFO,
    },
    {
      title: "Điểm danh",
      icon: faUserCheck,
      color: "from-green-400 to-blue-500",
      tab: TAB.ATTENDANCE,
    },
    {
      title: "Bài kiểm tra",
      icon: faFileAlt,
      color: "from-pink-400 to-blue-500",
      tab: TAB.TEST,
    },
  ].map(({ title, icon, color, tab }) => {
    const isActive = activeTab === tab;
    return (
      <div
        key={tab}
        className={`rounded-full p-[2px] w-full max-w-[400px] overflow-hidden 
          bg-gradient-to-r ${color} shadow-sm
        `}
      >
        <div className="rounded-full bg-white w-full h-full">
          <button
            onClick={() => setActiveTab(tab)}
            className={`w-full rounded-full py-4 px-6 font-semibold text-lg flex items-center justify-center
              transition-all duration-300
              ${isActive ? "text-blue-700 scale-[1.02]" : "text-gray-700"}
            `}
          >
            <FontAwesomeIcon icon={icon} className="mr-3 text-xl" />
            {title}
          </button>
        </div>
      </div>
    );
  })}
</div>

      {/* Tab content */}
      <div className="bg-white rounded-xl shadow p-6 min-h-[300px]">
        {activeTab === TAB.INFO && <ClassInfoTab classInfo={classInfo} />}
        {activeTab === TAB.STUDENTS && <StudentListTab students={classInfo?.students || []} />}
        {activeTab === TAB.ATTENDANCE && (
          <AttendanceTab classId={classInfo?._id} students={classInfo?.students || []} />
        )}
        {activeTab === TAB.TEST &&
          <div>
            <TestTab
              classId={classInfo?._id}
              courseId={classInfo?.course?._id}
            />
          </div>}
      </div>
    </div>
  );
};
