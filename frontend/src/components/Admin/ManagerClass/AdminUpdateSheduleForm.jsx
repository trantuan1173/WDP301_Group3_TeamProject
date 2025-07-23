import React, { useState, useEffect } from "react";

export default function AdminUpdateSheduleForm({ open, onClose, event, onSave, onError }) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [userSetEnd, setUserSetEnd] = useState(false);
  const [error, setError] = useState("");

  // Helper để lấy ngày hôm nay dạng YYYY-MM-DD
  const todayStr = new Date().toISOString().slice(0, 10);
  // Helper để lấy giờ hiện tại dạng HH:MM
  const now = new Date();
  const nowTimeStr = now.toTimeString().slice(0, 5);

  useEffect(() => {
    if (event) {
      const start = event.start instanceof Date ? event.start : new Date(event.start);
      const end = event.end instanceof Date ? event.end : new Date(event.end);
      setDate(start.toISOString().slice(0, 10));
      setStartTime(start.toISOString().slice(11, 16));
      setEndTime(end.toISOString().slice(11, 16));
      setUserSetEnd(false);
      setError("");
    }
  }, [event]);

  const handleStartTimeChange = (val) => {
    setStartTime(val);
    if (!userSetEnd) {
      const [h, m] = val.split(":").map(Number);
      const endH = (h + 2) % 24;
      const endStr = `${endH.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
      setEndTime(endStr);
    }
  };

  const handleEndTimeChange = (val) => {
    setEndTime(val);
    setUserSetEnd(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await onSave({
        date: new Date(date).toISOString(),
        start_time: new Date(`${date}T${startTime}`).toISOString(),
        end_time: new Date(`${date}T${endTime}`).toISOString(),
      });
    } catch (err) {
      console.error("Full error object:", err);
      if (err?.response?.status === 409) {
        setError("Teacher has a schedule conflict.");
      } else {
        setError("Failed to update schedule.");
      }
    }
  };

  // Không cho mở nếu không open
  if (!open) return null;

  // Kiểm tra nếu chọn ngày là hôm nay thì không cho chọn giờ quá khứ
  const minTime = date === todayStr ? nowTimeStr : "00:00";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onClick={onClose}
    >
      <form
        className="bg-white p-6 rounded shadow-md min-w-[300px]"
        onClick={e => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h3 className="font-bold mb-4 text-2xl">Edit Schedule</h3>

        {/* Hiển thị thông báo lỗi nếu có */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-3 text-center font-bold">
            {error}
          </div>
        )}

        <div className="flex gap-4 mb-4">
          <label className="block flex-1">
            Date:
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="border rounded px-2 py-1 w-full"
              required
              min={todayStr}
            />
          </label>
          <label className="block flex-1">
            Start:
            <input
              type="time"
              value={startTime}
              onChange={e => handleStartTimeChange(e.target.value)}
              className="border rounded px-2 py-1 w-full"
              required
              min={minTime}
              max="23:59"
            />
          </label>
          <label className="block flex-1">
            End:
            <input
              type="time"
              value={endTime}
              onChange={e => handleEndTimeChange(e.target.value)}
              className="border rounded px-2 py-1 w-full"
              required
              min={startTime}
              max="23:59"
            />
          </label>
        </div>

        <div className="flex gap-2 mt-4">
          <button type="submit" className="bg-indigo-700 text-white px-4 py-2 rounded">Save</button>
          <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}