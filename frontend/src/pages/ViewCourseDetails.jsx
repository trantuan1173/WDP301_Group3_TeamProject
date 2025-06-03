import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from '../config';
import { useNavigate } from "react-router-dom";

const ViewCourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

  useEffect(() => {
    axios.get(API_ENDPOINTS.GET_COURSE_BY_ID(courseId))
      .then(res => {
        // Log để kiểm tra cấu trúc dữ liệu
        console.log("API DATA:", res.data);
        setCourse((res.data.data && res.data.data[0]) || res.data[0] || null);

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setCourse(null);
      });
  }, [courseId]);

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found.</div>;

  return (
    <div style={{ background: "#f3f7fd", minHeight: "100vh", padding: 0 }}>
      {/* Header section with background image */}
      <div
        style={{
    background: `url(/images/viewcourse.png) center/cover no-repeat`,
    padding: "32px 0 56px 0",
    position: "relative",
    minHeight: 320,
    display: "flex",
    alignItems: "center"
  }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            background: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "6px 18px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 8px #0001",
            zIndex: 2
          }}
        >Back</button>
        <div style={{
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
          zIndex: 1
        }}>
          <div>
            <h1 style={{ color: "#fff", fontSize: 48, fontWeight: 700, marginBottom: 12, textShadow: "0 2px 8px #0006" }}>
              {course.courseName || course.nameCourses || "Name Courses"}
            </h1>
            <div style={{ color: "#fff", fontSize: 22, marginBottom: 4, textShadow: "0 2px 8px #0006" }}>
              Level: {course.level}
            </div>
            <div style={{ color: "#fff", fontSize: 20, textShadow: "0 2px 8px #0006" }}>
              Duration: {course.durationDays} days
            </div>
          </div>
          
        </div>
      </div>

      {/* Main content */}
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        marginTop: -80,
        display: "flex",
        gap: 32,
        alignItems: "flex-start",
        flexWrap: "wrap",
          position: "relative", // Thêm dòng này
          minHeight: 400

      }}>
        {/* Description box */}
        <div style={{
  flex: 2,
  background: "#eaf4ff",
  borderRadius: 16,
  padding: 32,
  minHeight: 220,
  fontSize: 20,
  fontWeight: 500,
  boxShadow: "0 8px 32px #0003",
  marginTop: "150px" // Thêm dòng này để cách bg 10px
}}>
  <span style={{ fontWeight: 700 }}>Description:</span> {course.description || "Mô tả chi tiết ...."}
</div>

        {/* Card bên phải */}
        <div style={{
          flex: 1,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 8px 32px #0003",
          padding: 24,
          minWidth: 320,
          maxWidth: 380,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <img
            src={course.imageURL}
            alt={course.level}
            style={{
              width: "100%",
              borderRadius: 12,
              marginBottom: 16,
              objectFit: "cover"
            }}
          />
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
            Ưu đãi đặc biệt tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
          </div>
          <button
            style={{
              marginTop: 24,
              width: "100%",
              background: "#2d1ca0",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "14px 0",
              fontWeight: 700,
              fontSize: 22,
              cursor: "pointer",
              letterSpacing: 1
            }}
          >
            Đăng ký
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewCourseDetails;