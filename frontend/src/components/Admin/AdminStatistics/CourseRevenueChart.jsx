import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { API_ENDPOINTS } from "../../../config";

const CourseRevenueChart = () => {
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.GET_STATISTICS_EVENT("paymentSuccess"));
        const raw = res.data.data;

        const revenueMap = {};
        raw.forEach((event) => {
          const { courseId, amount } = event.eventData;
          if (!revenueMap[courseId]) {
            revenueMap[courseId] = { total: 0, count: 0 };
          }
          revenueMap[courseId].total += amount;
          revenueMap[courseId].count += 1;
        });

    
        const entries = await Promise.all(
          Object.entries(revenueMap).map(async ([courseId, { total, count }]) => {
            try {
              const courseRes = await axios.get(API_ENDPOINTS.GET_COURSE(courseId));
              const courseName = courseRes.data?.data?.nameCourses;
              return { courseName, total, count };
            } catch {
              return { courseName: `Unknown (${courseId})`, total, count };
            }
          })
        );

        setRevenueData(entries);
      } catch (error) {
        console.error("Fetch paymentSuccess error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow mt-8">
      <h2 className="text-2xl font-bold text-green-600 mb-4">Revenue per course</h2>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="courseName" interval={0} angle={-20} textAnchor="end" height={80} />
          <YAxis yAxisId="left" orientation="left" stroke="#4f46e5" />
          <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="total" fill="#4f46e5" name="Total revenue (VND)" />
          <Bar yAxisId="right" dataKey="count" fill="#10b981" name="Number of payments" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CourseRevenueChart;