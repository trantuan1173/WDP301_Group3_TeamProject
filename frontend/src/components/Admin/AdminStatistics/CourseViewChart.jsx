import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import { API_ENDPOINTS } from "../../../config";

const CourseViewChart = () => {
  const [courseViews, setCourseViews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.GET_STATISTICS_EVENT("viewCourse"));
        const raw = res.data.data;

        const countMap = {};
        raw.forEach((event) => {
          const courseId = event.eventData.courseId;
          countMap[courseId] = (countMap[courseId] || 0) + 1;
        });

        const entries = await Promise.all(
          Object.entries(countMap).map(async ([courseId, count]) => {
            try {
              const courseRes = await axios.get(API_ENDPOINTS.GET_COURSE(courseId));
              const courseName = courseRes.data?.data?.nameCourses;
              return { courseName, count };
            } catch {
              return { courseName: `Unknown (${courseId})`, count };
            }
          })
        );

        setCourseViews(entries);
      } catch (error) {
        console.error("Fetch viewCourse error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow mt-8">
      <h2 className="text-2xl font-bold text-indigo-600 mb-4">Number of views per course</h2>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={courseViews}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="courseName" interval={0} angle={-20} textAnchor="end" height={80} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#4f46e5" name="Number of views" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CourseViewChart;