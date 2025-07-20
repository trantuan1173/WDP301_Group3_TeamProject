import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import ClassInfoTab from "./ClassInfoTab";

import AttendanceTab from "./AttendanceTab";
import TestTab from "./TestTab";
import  ScoreTab  from "./ScoreTab";
import LoadingSpinner from "../../LoadingSpinner"; // Assuming you have a LoadingSpinner component
const TAB = {
  INFO: "INFO",
  STUDENTS: "STUDENTS",
  ATTENDANCE: "ATTENDANCE",
  TEST: "TEST",
  SCORE: "SCORE",
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

  if (loading) return <LoadingSpinner size={120} text="Loading..." />;


  return (
    <div className="p-8 bg-[#f6f7fb] min-h-screen">
  {onBack && (
    <button
      className="mb-4 px-4 py-2 border-2 border-[#1a237e] rounded text-[#1a237e] font-semibold hover:bg-[#eaeafc]"
      onClick={onBack}
    >
      Back
    </button>
  )}

  <h1 className="text-2xl font-bold mb-5">
    Class: {classInfo?.className || "Tên lớp học"}
  </h1>

  {/* Bọc cả tabs và content */}
  <div className="w-full  mx-auto ">
    {/* Tabs */}
    <div className="flex bg-white rounded-xl shadow overflow-hidden mb-8 w-full">
      {[
        { label: "Process", tab: TAB.INFO },
        { label: "Attendance", tab: TAB.ATTENDANCE },
        { label: "Test", tab: TAB.TEST },
        { label: "Score", tab: TAB.SCORE },
      ].map(({ label, tab }, index, array) => {
        const isFirst = index === 0;
        const isLast = index === array.length - 1;
        const isActive = activeTab === tab;

        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1  px-8 py-4 text-sm font-bold transition-all
              ${isActive ? "bg-[#1a237e] text-white" : "text-[#1a237e] hover:bg-[#f6f7fb]"}
              ${isFirst ? "rounded-l-xl" : ""}
              ${isLast ? "rounded-r-xl" : ""}
            `}
          >
            {label}
          </button>
        );
      })}
    </div>

    {/* Tab content */}
    <div className="bg-white rounded-xl shadow p-6 min-h-[300px]">
      {activeTab === TAB.INFO && <ClassInfoTab classInfo={classInfo} />}
      {activeTab === TAB.ATTENDANCE && (
        <AttendanceTab classId={classInfo?._id} students={classInfo?.students || []} />
      )}
      {activeTab === TAB.TEST && (
        <TestTab classId={classInfo?._id} courseId={classInfo?.course?._id} />
      )}
      {activeTab === TAB.SCORE && (
        <div>
          <ScoreTab classId={classInfo?._id} courseId={classInfo?.course?._id} />
        </div>
      )}
    </div>
  </div>
</div>


  );
}