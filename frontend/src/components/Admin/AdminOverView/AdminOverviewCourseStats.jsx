import React from "react";
export default function AdminOverviewCourseStats({ courses }) {
  // Thống kê số lượng theo type
  const stats = courses.reduce((acc, cur) => {
    acc[cur.type] = (acc[cur.type] || 0) + 1;
    return acc;
  }, {});
  return (
    <div className="bg-white rounded shadow p-6 flex-1">
      <div className="font-bold mb-2">Courses Statistics</div>
      <div className="flex gap-4 mt-4">
        {Object.entries(stats).map(([type, count]) => (
          <div key={type} className="flex flex-col items-center">
            <div className="w-12 h-24 bg-lime-400 rounded mb-2 flex items-end justify-center">
              <div className="text-xl font-bold">{count}</div>
            </div>
            <div className="text-sm">{type.toUpperCase()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}