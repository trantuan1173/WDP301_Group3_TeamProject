import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import { FaEdit } from "react-icons/fa";

const WEEKDAYS = [
  { label: "Sunday", value: 0 },
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
];

export default function AdminCreateSchedule({ classId, onSuccess, onCancel }) {
  const [selectedWeekdays, setSelectedWeekdays] = useState([]);
  const [weekdayTimes, setWeekdayTimes] = useState({});
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [durationDays, setDurationDays] = useState(0);
  const [startDate, setStartDate] = useState(() => {
    // Mặc định là ngày hôm nay, format yyyy-MM-dd
    const now = new Date();
    return now.toISOString().slice(0, 10);
  });
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState({ date: "", start: "", end: "" });
  const handleEdit = (idx) => {
    const sch = preview[idx];
    setEditIdx(idx);
    setEditData({
      date: sch.date,
      start: sch.start_time.slice(11, 16),
      end: sch.end_time.slice(11, 16),
    });
  };

  // Hàm lưu edit
  const handleSaveEdit = () => {
    // Kiểm tra trùng ngày
    const isDuplicate = preview.some((sch, idx) =>
      idx !== editIdx && sch.date === editData.date
    );
    if (isDuplicate) {
      alert("Ngày này đã có lịch học khác!");
      return;
    }
    setPreview(prev => prev.map((sch, idx) =>
      idx === editIdx
        ? {
          ...sch,
          date: editData.date,
          start_time: new Date(`${editData.date}T${editData.start}`).toISOString(),
          end_time: new Date(`${editData.date}T${editData.end}`).toISOString(),
        }
        : sch
    ));
    setEditIdx(null);
  };

  // Lấy số buổi học từ course
  useEffect(() => {
    const fetchClassAndCourse = async () => {
      try {
        const token = localStorage.getItem("token");
        const resClass = await axios.get(API_ENDPOINTS.GET_CLASS_BY_ID(classId), {
          headers: { Authorization: `Bearer ${token}` }
        });
        const courseId = resClass.data.data?.course?._id || resClass.data.data?.courseId;
        if (courseId) {
          const resCourse = await axios.get(API_ENDPOINTS.GET_COURSE_BY_ID(courseId), {
            headers: { Authorization: `Bearer ${token}` }
          });
          let courseDetail = null;
          if (Array.isArray(resCourse.data.data)) {
            courseDetail = resCourse.data.data[0];
          } else if (resCourse.data.data) {
            courseDetail = resCourse.data.data;
          } else if (Array.isArray(resCourse.data)) {
            courseDetail = resCourse.data[0];
          }
          setDurationDays(courseDetail?.durationDays || 0);
        }
      } catch (err) {
        setError("No information class or course.");
      }
    };
    fetchClassAndCourse();
  }, [classId]);

  // Sinh lịch học preview
  useEffect(() => {
    if (!durationDays || selectedWeekdays.length === 0) {
      setPreview([]);
      return;
    }
    const firstDate = new Date(startDate);
    const previewData = generateScheduleDates(firstDate, selectedWeekdays, durationDays, weekdayTimes);
    setPreview(previewData);
  }, [durationDays, selectedWeekdays, weekdayTimes, startDate]);

  // Hàm sinh lịch học
  function generateScheduleDates(firstDate, weekdays, duration, weekdayTimes) {
    let result = [];
    let count = 0;
    let currentDate = new Date(firstDate);

    weekdays = [...weekdays].sort((a, b) => a - b);

    while (count < duration) {
      for (let i = 0; i < weekdays.length && count < duration; i++) {
        let day = weekdays[i];
        let nextDate = new Date(currentDate);

        // Nếu là lần đầu tiên, kiểm tra luôn ngày bắt đầu
        if (result.length === 0) {
          if (nextDate.getDay() === day) {
            // Lấy giờ start/end
            const { start: startHour = "09:00", end: endHour = "11:00" } = weekdayTimes[day] || {};
            let dateStr = nextDate.toISOString().split("T")[0];
            let start_time = new Date(`${dateStr}T${startHour}`);
            let end_time = new Date(`${dateStr}T${endHour}`);

            result.push({
              date: dateStr,
              start_time: start_time.toISOString(),
              end_time: end_time.toISOString(),
            });
            count++;
            continue; // sang thứ tiếp theo
          }
        }

        // Tìm ngày tiếp theo có thứ là weekdays[i]
        let diff = (day + 7 - nextDate.getDay()) % 7;
        if (diff === 0 && result.length === 0) continue; // đã xử lý ở trên
        nextDate.setDate(nextDate.getDate() + diff);

        const { start: startHour = "09:00", end: endHour = "11:00" } = weekdayTimes[day] || {};
        let dateStr = nextDate.toISOString().split("T")[0];
        let start_time = new Date(`${dateStr}T${startHour}`);
        let end_time = new Date(`${dateStr}T${endHour}`);

        result.push({
          date: dateStr,
          start_time: start_time.toISOString(),
          end_time: end_time.toISOString(),
        });

        
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 7);
    }
    return result;
  }

  // Khi chọn thứ, set giờ mặc định nếu chưa có
  const handleWeekdayChange = (value) => {
    setSelectedWeekdays((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
    setWeekdayTimes((prev) =>
      prev[value]
        ? prev
        : { ...prev, [value]: { start: "09:00", end: "11:00" } }
    );
  };

  // Khi chọn giờ bắt đầu, tự động set giờ kết thúc +2h nếu chưa chỉnh end
  const handleTimeChange = (weekday, type, val) => {
    setWeekdayTimes((prev) => {
      if (type === "start") {
        let [h, m] = val.split(":").map(Number);
        let endH = (h + 2) % 24;
        let endStr = `${endH.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
        // Nếu end chưa chỉnh hoặc end đang đúng theo start+2h thì tự động cập nhật
        const prevEnd = prev[weekday]?.end || "11:00";
        const prevStart = prev[weekday]?.start || "09:00";
        let autoEnd = prevEnd;
        if (!prev[weekday]?.userSetEnd || prevEnd === getAutoEnd(prevStart)) {
          autoEnd = endStr;
        }
        return {
          ...prev,
          [weekday]: {
            ...prev[weekday],
            start: val,
            end: autoEnd,
            userSetEnd: false,
          },
        };
      }
      if (type === "end") {
        return {
          ...prev,
          [weekday]: {
            ...prev[weekday],
            end: val,
            userSetEnd: true,
          },
        };
      }
      return prev;
    });
  };

  function getAutoEnd(start) {
    let [h, m] = start.split(":").map(Number);
    let endH = (h + 2) % 24;
    return `${endH.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedWeekdays.length === 0) {
      setError("Vui lòng chọn ít nhất 1 thứ trong tuần.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      // Chuẩn bị mảng lịch học theo mẫu API mới
      const schedules = preview.map(sch => ({
        classId,
        date: sch.date,
        start_time: sch.start_time,
        end_time: sch.end_time,
      }));
      await axios.post(
  API_ENDPOINTS.CREATE_BULK_SCHEDULE,
  schedules,
  { headers: { Authorization: `Bearer ${token}` } }
);

// Cập nhật end_time cho lớp học bằng end_time của buổi cuối cùng
if (schedules.length > 0) {
  const lastSchedule = schedules[schedules.length - 1];
  await axios.put(
    API_ENDPOINTS.UPDATE_CLASS(classId),
    { end_time: lastSchedule.end_time },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

if (onSuccess) onSuccess();
  } catch (err) {
    if (err?.response?.status === 409) {
      setError("Teacher has a schedule conflict.");
    } else {
      setError("Tạo lịch học thất bại.");
    }
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={onCancel}>
      <div className="bg-white rounded-xl p-6 w-full max-w-5xl shadow-lg relative" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4 text-center">Auto Schedule Creation</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-3 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Select start date:</label>
            <input
              type="date"
              value={startDate}
              min={new Date().toISOString().slice(0, 10)}
              onChange={e => setStartDate(e.target.value)}
              className="bg-blue-100 p-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Select weekdays and lesson time:</label>
            <div className="flex gap-2 flex-wrap">
              {WEEKDAYS.map(day => (
                <div key={day.value} className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={selectedWeekdays.includes(day.value)}
                    onChange={() => handleWeekdayChange(day.value)}
                  />
                  <span>{day.label}</span>
                  {selectedWeekdays.includes(day.value) && (
                    <>
                      <input
                        type="time"
                        value={weekdayTimes[day.value]?.start || "09:00"}
                        onChange={e => handleTimeChange(day.value, "start", e.target.value)}
                        className="bg-blue-100 p-1 rounded"
                        style={{ width: 130 }}
                        step={60}
                        min="00:00"
                        max="23:59"
                      />
                      <span>-</span>
                      <input
                        type="time"
                        value={weekdayTimes[day.value]?.end || getAutoEnd(weekdayTimes[day.value]?.start || "09:00")}
                        onChange={e => handleTimeChange(day.value, "end", e.target.value)}
                        className="bg-blue-100 p-1 rounded"
                        style={{ width: 130 }}
                        step={60}
                        min="00:00"
                        max="23:59"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Schedule preview ({preview.length} sessions):</label>
            <div className="overflow-auto border rounded bg-gray-50" style={{ maxHeight: 300 }}>
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-blue-100">
                    <th className="px-2 py-1 text-left">Slot</th>
                    <th className="px-2 py-1 text-left">Date</th>
                    <th className="px-2 py-1 text-left">Start</th>
                    <th className="px-2 py-1 text-left">End</th>
                    <th className="px-2 py-1 text-left">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {[...preview]
                    .map((sch, idx) => ({ ...sch, originalIdx: idx })) // Gắn index gốc
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((sch, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                        <td className="px-2 py-1">{idx + 1}</td>
                        <td className="px-2 py-1">{new Date(sch.date).toLocaleDateString()}</td>
                        <td className="px-2 py-1">
                          {new Date(sch.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </td>
                        <td className="px-2 py-1">
                          {new Date(sch.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </td>
                        <td className="px-2 py-1">
                          <button
                            type="button"
                            className="text-blue-600 underline"
                            onClick={() => handleEdit(sch.originalIdx)}
                          >
                            <FaEdit className="inline mr-1" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {/* Modal edit */}
            {editIdx !== null && (
              <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={() => setEditIdx(null)}>
                <div className="bg-white p-4 rounded shadow min-w-[300px]" onClick={e => e.stopPropagation()}>
                  <h3 className="font-bold mb-2">Edit session</h3>
                  <div className="mb-2">
                    <label className="block mb-1">Date:</label>
                    <input
                      type="date"
                      value={editData.date}
                      onChange={e => setEditData({ ...editData, date: e.target.value })}
                      className="border rounded px-2 py-1 w-full"
                      min={startDate}
                    />
                  </div>
                  <div className="mb-2 flex gap-2">
                    <div className="flex-1">
                      <label className="block mb-1">Start:</label>
                      <input
                        type="time"
                        value={editData.start}
                        onChange={e => {
                          const start = e.target.value;
                          // Auto set end time +2h
                          let [h, m] = start.split(":").map(Number);
                          let endH = (h + 2) % 24;
                          let endStr = `${endH.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
                          setEditData({ ...editData, start, end: endStr });
                        }}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block mb-1">End:</label>
                      <input
                        type="time"
                        value={editData.end}
                        onChange={e => setEditData({ ...editData, end: e.target.value })}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <button className="bg-gray-300 px-4 py-1 rounded" onClick={() => setEditIdx(null)}>Cancel</button>
                    <button className="bg-indigo-700 text-white px-4 py-1 rounded" onClick={handleSaveEdit}>Save</button>
                  </div>
                </div>
              </div>
            )}

          </div>
          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-900 text-white px-6 py-2 rounded hover:bg-indigo-800"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}