import React, { useEffect, useState } from "react";
import TeacherQuickAction from "./TeacherQuickAction";
import TeacherSheduleToday from "./TeacherSheduleToday";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import { jwtDecode } from "jwt-decode";

import LoadingSpinner from "../../LoadingSpinner";


export default function TeacherOverView({ onQuickAction }) {
  const [profile, setProfile] = useState(null);

  // Lấy userId từ token ở ngoài để dùng cho các component con
  let userId = "";
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.id;
    } catch (e) {
      userId = "";
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(API_ENDPOINTS.GET_PROFILE_BY_USERID(userId), {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
        setProfile(data);
      } catch (err) {
        setProfile(null);
      }
    };
    fetchProfile();
  }, [userId, token]);
  if (!profile) return <LoadingSpinner size={120} text="LOADING" />;

  return (
    <div>
      {/* Banner */}
      <div
        style={{
          position: "relative",
          height: 295,
          overflow: "hidden",
          marginBottom: 24,
        }}
      >
        {/* Banner Text Overlay */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 40,
            zIndex: 2,
            color: "#FFFFFF",
            padding: "16px 24px",
            borderRadius: 12,
            maxWidth: "60%",
            marginTop: 60,
            marginLeft: 90,
          }}
        >
          <h3
            className="text-2xl font-bold mb-2"
            style={{ color: "#FFFFFF", fontSize: 32 }}
          >
            Improve your students skills
          </h3>
          <span style={{ color: "#FFFFFF", fontSize: 24 }}>
            Our great system is good for your schools/university
          </span>
          <br />
          <button
            style={{
              marginTop: 12,
              background: "#FFFFFF",
              color: "#3B2175",
              border: "none",
              fontWeight: "bold",
              fontSize: 24,
              borderRadius: 17,
              padding: "6px 20px",
              marginLeft: 60,
              height: 67,
              width: 264,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            Create Exam
          </button>
        </div>
        {/* Banner Image */}
        <img
          src="/images/viewcourse.png"
          alt="Dashboard Banner Illustration"
          className="w-full h-auto rounded-lg shadow-lg"
          style={{
            height: 300,
            objectFit: "cover",
            objectPosition: "center -5px",
            width: "100%",
          }}
        />
      </div>

      {/* Profile greeting */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={profile?.profile?.imageURL || "/avatar-default.png"}
          alt="avatar"
          className="w-16 h-16 rounded-full border object-cover"
        />
        <div>
          <div className="font-bold text-xl">Hello, {profile?.profile?.name || profile?.email || "Teacher"}</div>
          <div className="text-gray-600">Have a nice day, let's progress together!</div>
        </div>
      </div>
      <hr className="mb-6" />

      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Quick Actions, Take Attendance, Latest Upload */}
        <div className="flex flex-col gap-6">
          <TeacherQuickAction onQuickAction={(key) => onQuickAction(key)} />

          {/* Take attendance */}
          
          {/* Latest upload file test */}
          
        </div>
        {/* Right: Today Schedule */}
        <div>
          
          <TeacherSheduleToday userId={userId} />
        </div>
      </div>
    </div>
  );
}