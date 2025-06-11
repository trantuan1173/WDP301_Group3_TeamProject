import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";

const mockAttendanceData = [
  {
    courseName: "Toeic Foundation",
    attended: 24,
    absent: 6,
    imageUrl: "https://res.cloudinary.com/dvdnw79tk/image/upload/v1748274329/fkuosc3jod4alzg18e39.png",
  },
  {
    courseName: "Toeic Advanced",
    attended: 28,
    absent: 2,
    imageUrl: "https://res.cloudinary.com/dvdnw79tk/image/upload/v1748274329/fkuosc3jod4alzg18e39.png",
  },
];

const COLORS = ["#4ade80", "#f87171"];

const AttendanceOverview = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Attendance Overview</h2>
      <div className="space-y-4">
        {mockAttendanceData.map((course, index) => {
          const pieData = [
            { name: "Attended", value: course.attended },
            { name: "Absent", value: course.absent },
          ];

          return (
            <div
              key={index}
              className="flex items-center bg-white border rounded-xl shadow-sm p-2"
            >
              <img
                src={course.imageUrl}
                alt="Course"
                className="w-28 h-28 object-cover rounded-lg mr-4"
              />

              <div className="flex-1 ml-4">
                <h3 className="text-lg font-semibold mb-1">{course.courseName}</h3>
                <p>Total: <strong>{course.attended + course.absent} sessions</strong></p>
                <button
                  onClick={() => navigate(`/attendance/${course.courseName}`)}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                >
                  Details
                </button>
              </div>

              <div className="ml-auto">
                <PieChart width={120} height={120}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={40}
                    label
                    dataKey="value"
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendanceOverview;