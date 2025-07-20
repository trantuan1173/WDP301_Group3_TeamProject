import React, { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { API_ENDPOINTS } from "../../../config";

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
        // Đếm số buổi đã qua (ngày <= hôm nay)
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
    <div className="flex flex-col md:flex-row gap-8 items-center px-8">
      <div className="flex-1 text-[1.125rem]"> 
        <div className="font-bold text-xl mb-2 text-[#1a237e]"> 
          Class Details
        </div>
        <div className="mb-2">
          <span className="font-bold">Course:</span>{" "}
          <span className="font-semibold">{detail.level || "?"}</span>
        </div>
        <div className="mb-2">
          <span className="font-bold">Level:</span>{" "}
          <span className="font-semibold">{detail.level || "?"}</span>
        </div>
        <div className="mb-2">
          <span className="font-bold">Type:</span>{" "}
          <span className="font-semibold">{detail.type || "?"}</span>
        </div>
        <div className="mb-2">
          <span className="font-bold">Progress:</span>{" "}
          <span className="font-semibold">
            {sessionsDone}/{detail.durationDays || "?"} Slots
          </span>
        </div>
        <div className="mb-2">
          <span className="font-bold">Class note:</span>{" "}
          <span className="font-semibold">{classInfo.note || "No note"}</span>
        </div>
      </div>

      {/* Vòng tròn progress */}
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
          
          strokeLinecap: 'round', 
        })}
        strokeWidth={10} 
      />          
    </div>       
  </div>  
    </div>
  );
}