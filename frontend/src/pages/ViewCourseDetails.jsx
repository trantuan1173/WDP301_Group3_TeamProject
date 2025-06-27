import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from '../config';
import NavBar from '../components/Layouts/NavBar';

const ViewCourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [enrolled, setEnrolled] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(API_ENDPOINTS.GET_COURSE_BY_ID(courseId))
      .then(res => {
        console.log("API DATA:", res.data);
        setCourse((res.data.data) || null);

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setCourse(null);
      });
  }, []);
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get(API_ENDPOINTS.AUTH_PROFILE, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.data);
      } catch (error) {
        localStorage.removeItem("token");
      }
    };
    fetchUser();
  }, []);

  // Kiểm tra enrollment
  useEffect(() => {
    const fetchEnrollment = async () => {
      if (!user?._id) return;
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(API_ENDPOINTS.GET_STUDENT_EROLLMENT(user._id), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const found = res.data.data.find(
          e =>
            (e.courseId && (e.courseId._id === courseId || e.courseId === courseId)) &&
            ["pending", "active"].includes(e.status)
        );
        setEnrolled(!!found);
      } catch (err) {
        setEnrolled(false);
      }
    };
    fetchEnrollment();
  }, [user, courseId]);

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found.</div>;

  return (
    <div className="h-screen flex flex-col">
      <header className="w-full ">
        <NavBar />
      </header>
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
          >
            Back
          </button>
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
                {course.courseId.nameCourses || "Name Courses"}
              </h1>
              <div style={{
                color: "#fff",
                fontSize: 22,
                marginBottom: 4,
                textShadow: "0 2px 8px #0006"
              }}>
                Level: {course.level}
              </div>
              <div style={{
                color: "#fff",
                fontSize: 20,
                textShadow: "0 2px 8px #0006"
              }}>
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
          position: "relative",
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
            marginTop: "150px",
            whiteSpace: "pre-line"
          }}>
            <span style={{ fontWeight: 700 }}>Description:</span> {course.description || "Mô tả chi tiết ...."}
          </div>

          {/* Card bên phải cố định khi cuộn */}
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
            alignItems: "center",
            position: "sticky",
            top: 100,
            height: "fit-content"
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
              onClick={() => {
                if (!enrolled) navigate(`/enroll/${courseId}`);
              }}
              style={{
                marginTop: 24,
                width: "100%",
                background: enrolled ? "#22c55e" : "#2d1ca0",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "14px 0",
                fontWeight: 700,
                fontSize: 22,
                cursor: enrolled ? "not-allowed" : "pointer",
                letterSpacing: 1
              }}
              disabled={enrolled}
            >
              {enrolled ? "Enrolled" : "Enroll"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCourseDetails;
