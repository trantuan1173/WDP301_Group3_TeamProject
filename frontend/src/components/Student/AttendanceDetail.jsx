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

  const total = records.length;
  const presentCount = records.filter(r => r.status === true).length;
  const absentCount = total - presentCount;
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
            {classInfo.course || "Unnamed Course"}
          </h1>
          <p className="text-gray-600 mt-4 flex items-center gap-2">
            <FaLayerGroup className="text-indigo-400" />
            <span className="font-medium">Class:</span> {classInfo.className || classInfo._id}
          </p>
          <p className="text-gray-600 flex items-center gap-2">
            <FaChalkboardTeacher className="text-indigo-400" /> 
            <span className="font-medium">Teacher ID:</span> {classInfo.teacherId || "N/A"}
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

        {/* Attendance records */}
        <div className="space-y-3">
          {records.map((rec) => (
            <div 
              key={rec._id}
              className="border rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <FaCalendarDay className="text-indigo-500" /> 
                {new Date(rec.date).toLocaleDateString()}
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${rec.status ? 'text-green-600' : 'text-red-500'}`}>
                {rec.status ? <FaCheckCircle /> : <FaTimesCircle />}
                {rec.status ? 'Present' : 'Absent'}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1 sm:mt-0">
                <FaRegStickyNote /> {rec.note || "No note"}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
