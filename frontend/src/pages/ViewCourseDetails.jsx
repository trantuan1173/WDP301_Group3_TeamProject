import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";

const ViewCourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_ENDPOINTS.GET_COURSES}/${courseId}`)
      .then(res => {
        setCourse(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [courseId]);

  if (loading) return <div>Loading...</div>;
  if (!course) return <div>Course not found.</div>;

  return (
    <div style={{maxWidth: 600, margin: "40px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px #0001", padding: 32}}>
      <h2 style={{marginBottom: 16}}>{course.level} {course.type?.toUpperCase()} Course</h2>
      <img src={course.imageURL} alt={course.level} style={{width: "100%", borderRadius: 8, marginBottom: 16}} />
      <div><b>Price:</b> ${course.price}</div>
      <div><b>Duration:</b> {course.durationDays} days</div>
      <div style={{margin: "12px 0"}}><b>Description:</b> {course.description}</div>
      <div><b>Created at:</b> {new Date(course.createdAt).toLocaleString()}</div>
    </div>
  );
};

export default ViewCourseDetails;