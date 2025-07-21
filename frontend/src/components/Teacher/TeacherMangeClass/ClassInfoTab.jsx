import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { API_ENDPOINTS } from "../../../config";
import {
  FaLayerGroup,
  FaTag,
  FaDollarSign,
  FaChartLine,

  FaBookOpen,
  FaClipboardList,
  FaStickyNote,

} from "react-icons/fa";

export default function ClassInfoTab({ classInfo }) {
  const [progress, setProgress] = useState(0);
  const [sessionsDone, setSessionsDone] = useState(0);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!classInfo || !classInfo._id) return;
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(API_ENDPOINTS.GET_SHEDULE_BY_CLASSID(classInfo._id), {
          headers: { Authorization: `Bearer ${token}` }
        });
        const schedules = res.data.data || [];
        const today = new Date();
        const doneCount = schedules.filter(sch => new Date(sch.date) <= today).length;
        setSessionsDone(doneCount);

        const durationDays = classInfo?.course?.detail?.durationDays || 1;
        const percent = Math.round((doneCount / durationDays) * 100);
        setProgress(percent > 100 ? 100 : percent);
      } catch (err) {
        setProgress(0);
        setSessionsDone(0);
      }
    };
    fetchProgress();
  }, [classInfo]);

  if (!classInfo) return <div>Loading class info...</div>;
  const course = classInfo.course || {};
  const detail = course.detail || {};

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-stretch px-4">
  {/* Left Info Section */}
  <div className="flex-1 text-base min-w-[260px]">
    <div className="font-bold text-2xl mb-4 text-indigo-700 flex items-center gap-2">
      <FaLayerGroup className="text-indigo-500" />
      Class Details
    </div>

    {/* Grid info - responsive */}
    <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-3">
      {/* Course */}
      <div className="pl-4 flex items-center gap-2">
        <FaBookOpen className="text-indigo-500" />
        <span className="font-bold">Course:</span>
        <span className="font-semibold truncate">{course.name || "?"}</span>
      </div>

      {/* Level */}
      <div className="flex items-center gap-2">
        <FaTag className="text-green-500" />
        <span className="font-bold">Level:</span>
        <span className="font-semibold">{detail.level || "?"}</span>
      </div>

      {/* Type */}
      <div className="pl-4 flex items-center gap-2">
        <FaClipboardList className="text-indigo-500" />
        <span className="font-bold">Type:</span>
        <span className="font-semibold uppercase px-2 py-0.5 rounded-md bg-blue-100 hover:bg-blue-200 transition">
          {detail.type || "?"}
        </span>
      </div>

      {/* Progress text */}
      <div className="flex items-center gap-2">
        <FaChartLine className="text-green-500" />
        <span className="font-bold">Progress:</span>
        <span className="font-semibold whitespace-nowrap">
          {sessionsDone}/{detail.durationDays || "?"} Slots
        </span>
      </div>

      {/* Note */}
      <div className="pl-4 flex items-center gap-2 sm:col-span-2">
        <FaStickyNote className="text-indigo-400" />
        <span className="font-bold">Class note:</span>
        <span className="font-semibold">{classInfo.note || "No note"}</span>
      </div>
    </div>
  </div>

  {/* Progress Circle */}
  <div className="flex justify-center items-center min-w-[200px]">
    <div className="flex flex-col items-center justify-center h-[240px]">
      <div style={{ width: 180, height: 180 }}>
        <CircularProgressbar
          value={progress}
          text={`${progress}%`}
          styles={buildStyles({
            textSize: "22px",
            textColor: "#1a237e",
            pathColor: "#1565c0",
            trailColor: "#bdbdbd",
            textFontWeight: "700",
            textFontFamily: "'Poppins', 'Segoe UI', sans-serif",
            pathTransitionDuration: 0.5,
            strokeLinecap: "round",
          })}
          strokeWidth={10}
        />
      </div>
      <div className="mt-3 text-xl font-bold" style={{ color: "#1565c0" }}>
        Progress
      </div>
    </div>
  </div>
</div>

  );
}