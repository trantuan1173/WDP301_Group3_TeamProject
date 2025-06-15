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

  // Lấy số buổi học
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
    let start = new Date(firstDate);
    let result = [];
    let count = 0;
    // Tuần đầu chỉ lấy các thứ >= hôm nay
    let firstWeekDates = weekdays
      .filter(weekday => weekday >= start.getDay())
      .map(weekday => {
        let date = new Date(start);
        let diff = (weekday + 7 - date.getDay()) % 7;
        date.setDate(date.getDate() + diff);
        return { weekday, date };
      });
    // Các tuần sau lấy đủ các thứ
    let otherWeekdays = weekdays.filter(weekday => weekday < start.getDay());
    let week = 0;
    while (count < duration) {
      // Tuần đầu
      if (week === 0) {
        for (let { weekday, date } of firstWeekDates) {
          if (count >= duration) break;
          const { start: startHour = "09:00", end: endHour = "12:00" } = weekdayTimes[weekday] || {};
          let dateStr = date.toISOString().split("T")[0];
          let start_time = new Date(`${dateStr}T${startHour}:00.000Z`);
          let end_time = new Date(`${dateStr}T${endHour}:00.000Z`);
          result.push({
            date: dateStr,
            start_time: start_time.toISOString(),
            end_time: end_time.toISOString(),
          });
          count++;
        }
      } else {
        for (let weekday of weekdays) {
          if (count >= duration) break;
          let date = new Date(start);
          let diff = (weekday + 7 - start.getDay()) % 7 + week * 7;
          date.setDate(date.getDate() + diff);
          const { start: startHour = "09:00", end: endHour = "12:00" } = weekdayTimes[weekday] || {};
          let dateStr = date.toISOString().split("T")[0];
          let start_time = new Date(`${dateStr}T${startHour}:00.000Z`);
          let end_time = new Date(`${dateStr}T${endHour}:00.000Z`);
          result.push({
            date: dateStr,
            start_time: start_time.toISOString(),
            end_time: end_time.toISOString(),
          });
          count++;
        }
      }
      week++;
    }
    return result;
  }

  const handleWeekdayChange = (value) => {
    setSelectedWeekdays((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
    // Nếu chọn mới thì set giờ mặc định cho thứ đó
    setWeekdayTimes((prev) =>
      prev[value]
        ? prev
        : { ...prev, [value]: { start: "09:00", end: "12:00" } }
    );
  };

  const handleTimeChange = (weekday, type, val) => {
    setWeekdayTimes((prev) => ({
      ...prev,
      [weekday]: {
        ...prev[weekday],
        [type]: val,
      },
    }));
  };

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
                      />
                      <span>-</span>
                      <input
                        type="time"
                        value={weekdayTimes[day.value]?.end || "12:00"}
                        onChange={e => handleTimeChange(day.value, "end", e.target.value)}
                        className="bg-blue-100 p-1 rounded"
                        style={{ width: 130 }}
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
                  {new Date(sch.date).toLocaleDateString()} | {new Date(sch.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(sch.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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