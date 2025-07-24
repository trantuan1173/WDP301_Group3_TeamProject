import { useLocation, useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaCalendarDay, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaRegStickyNote, 
  FaChalkboardTeacher, 
  FaBookOpen, 
  FaLayerGroup 
} from "react-icons/fa";

export default function AttendanceDetail() {
  const { state } = useLocation();
  const { records = [], classInfo = {} } = state || {};
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        No attendance detail found. Please return to overview.
      </div>
    );
  }

  // Tính tổng present/absent theo từng ngày (nếu có nhiều bản ghi cùng ngày)
  const groupedRecords = records.reduce((acc, rec) => {
    const dateStr = new Date(rec.date).toLocaleDateString();
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(rec);
    return acc;
  }, {});

  const total = records.length;
  const presentCount = records.filter(r => r.status === true).length;
  const absentCount = records.filter(r => r.status === false || r.status === null).length;
  const attendanceRate = total ? Math.round((presentCount / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
        
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          <FaArrowLeft /> Back to Overview
        </button>

        {/* Header info */}
        <div>
          <h1 className="text-3xl font-bold text-indigo-700 flex items-center gap-2">
            {classInfo.course?.name || classInfo.course || "Unnamed Course"}
          </h1>
          <p className="text-gray-600 mt-4 flex items-center gap-2">
            <FaLayerGroup className="text-indigo-400" />
            <span className="font-medium">Class:</span> {classInfo.className || classInfo._id}
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <FaChalkboardTeacher className="text-indigo-400" /> 
            <span className="font-medium">Teacher:</span> {classInfo.teacher?.profileId?.name || classInfo.teacherName || classInfo.teacherId || "N/A"}
          </p>
        </div>

        {/* Summary bar */}
        <div>
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="flex items-center gap-1 text-green-600">
              <FaCheckCircle /> Present: {presentCount}/{total}
            </span>
            <span className="flex items-center gap-1 text-red-500">
              <FaTimesCircle /> Absent: {absentCount}/{total}
            </span>
            <span className="font-semibold">{attendanceRate}% Attendance</span>
          </div>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-4 bg-green-500"
              style={{ width: `${attendanceRate}%` }}
            ></div>
          </div>
        </div>

        {/* Attendance records - nhóm theo ngày nếu có nhiều bản ghi cùng ngày */}
        <div className="space-y-3">
          {Object.entries(groupedRecords).map(([dateStr, recs]) => (
            <div 
              key={dateStr}
              className="border rounded-lg px-4 py-3 bg-gray-50 hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-2 text-gray-700 text-sm mb-2">
                <FaCalendarDay className="text-indigo-500" /> 
                {dateStr}
              </div>
              <div className="flex flex-wrap gap-4">
                {recs.map(rec => (
                  <div key={rec._id} className="flex items-center gap-3">
                    <span className={`flex items-center gap-1 text-sm font-medium ${rec.status ? 'text-green-600' : 'text-red-500'}`}>
                      {rec.status ? <FaCheckCircle /> : <FaTimesCircle />}
                      {rec.status ? 'Present' : 'Absent'}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <FaRegStickyNote /> {rec.note || "No note"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}