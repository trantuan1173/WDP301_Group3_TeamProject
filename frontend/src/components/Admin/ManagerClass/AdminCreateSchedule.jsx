import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";

const WEEKDAYS = [
  { label: "Thứ 2", value: 0 },
  { label: "Thứ 3", value: 1 },
  { label: "Thứ 4", value: 2 },
  { label: "Thứ 5", value: 3 },
  { label: "Thứ 6", value: 4 },
  { label: "Thứ 7", value: 5 },
  { label: "Chủ nhật", value: 6 },
];

export default function AdminCreateSchedule({ classId, onSuccess, onCancel }) {
  const [selectedWeekdays, setSelectedWeekdays] = useState([]);
  const [weekdayTimes, setWeekdayTimes] = useState({});
  const [preview, setPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [durationDays, setDurationDays] = useState(0);

  // Lấy số buổi học từ course
  useEffect(() => {
    const fetchClassAndCourse = async () => {
      try {
        const token = localStorage.getItem("token");
        const resClass = await axios.get(API_ENDPOINTS.GET_CLASS_BY_ID(classId), {
          headers: { Authorization: `Bearer ${token}` }
        });
        const courseId = resClass.data.data?.courseId?._id || resClass.data.data?.courseId;
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
        setError("Không lấy được thông tin lớp hoặc khóa học.");
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
    const today = new Date();
    const previewData = generateScheduleDates(today, selectedWeekdays, durationDays, weekdayTimes);
    setPreview(previewData);
  }, [durationDays, selectedWeekdays, weekdayTimes]);

  // Hàm sinh lịch học
  function generateScheduleDates(firstDate, weekdays, duration, weekdayTimes) {
    let result = [];
    let count = 0;
    let currentDate = new Date(firstDate);

    // Sắp xếp weekdays tăng dần
    weekdays = [...weekdays].sort((a, b) => a - b);

    while (count < duration) {
      for (let i = 0; i < weekdays.length && count < duration; i++) {
        // Tìm ngày tiếp theo có thứ là weekdays[i]
        let day = weekdays[i];
        let nextDate = new Date(currentDate);
        let diff = (day + 7 - nextDate.getDay()) % 7;
        nextDate.setDate(nextDate.getDate() + diff);

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
      }
      // Sau mỗi tuần, tăng currentDate lên 7 ngày
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
      for (const sch of preview) {
        await axios.post(API_ENDPOINTS.CREATE_SCHEDULE, {
          classId,
          date: sch.date,
          start_time: sch.start_time,
          end_time: sch.end_time,
        }, { headers: { Authorization: `Bearer ${token}` } });
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Tạo lịch học thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={onCancel}>
      <div className="bg-white rounded-xl p-6 w-full max-w-5xl shadow-lg relative" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4 text-center">Tạo lịch học tự động</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-3 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Chọn các thứ trong tuần và giờ học:</label>
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
            <label className="block mb-1 font-medium">Preview lịch học ({preview.length} buổi):</label>
            <div className="max-h-40 overflow-auto border rounded p-2 bg-gray-50">
              {preview.map((sch, idx) => (
                <div key={idx}>
                  {new Date(sch.date).toLocaleDateString()} | {new Date(sch.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} - {new Date(sch.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-500"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-indigo-900 text-white px-6 py-2 rounded hover:bg-indigo-800"
              disabled={loading}
            >
              {loading ? "Đang tạo..." : "Tạo lịch học"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}