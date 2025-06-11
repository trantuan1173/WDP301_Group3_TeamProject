// AttendanceDetails.js
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const mockSessionDetails = [
  {
    no: 1,
    date: "2025-06-01",
    slot: "1 (08:00 - 10:00)",
    room: "A101",
    lecturer: "Mr. John Doe",
    group: "TOEIC F-01",
    status: "Present",
    comment: "On time",
  },
  {
    no: 2,
    date: "2025-06-03",
    slot: "2 (10:00 - 12:00)",
    room: "A101",
    lecturer: "Mr. John Doe",
    group: "TOEIC F-01",
    status: "Absent",
    comment: "Sick leave",
  },
  {
    no: 3,
    date: "2025-06-05",
    slot: "1 (08:00 - 10:00)",
    room: "A101",
    lecturer: "Mr. John Doe",
    group: "TOEIC F-01",
    status: "Present",
    comment: "",
  },
];

const AttendanceDetails = () => {
  const { courseName } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Attendance Details: {courseName}</h2>

      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
      >
        ← Back
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-sm">No.</th>
              <th className="border p-2 text-sm">Date</th>
              <th className="border p-2 text-sm">Slot</th>
              <th className="border p-2 text-sm">Room</th>
              <th className="border p-2 text-sm">Lecturer</th>
              <th className="border p-2 text-sm">Group Name</th>
              <th className="border p-2 text-sm">Attendance Status</th>
              <th className="border p-2 text-sm">Lecturer's Comment</th>
            </tr>
          </thead>
          <tbody>
            {mockSessionDetails.map((session, index) => (
              <tr key={index} className="text-center">
                <td className="border p-2">{session.no}</td>
                <td className="border p-2">{session.date}</td>
                <td className="border p-2">{session.slot}</td>
                <td className="border p-2">{session.room}</td>
                <td className="border p-2">{session.lecturer}</td>
                <td className="border p-2">{session.group}</td>
                <td
                  className={`border p-2 font-semibold ${
                    session.status === "Present" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {session.status}
                </td>
                <td className="border p-2">{session.comment || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceDetails;
