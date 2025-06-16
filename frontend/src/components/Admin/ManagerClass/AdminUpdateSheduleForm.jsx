import React, { useState, useEffect } from "react";

export default function AdminUpdateSheduleForm({ open, onClose, event, onSave }) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [userSetEnd, setUserSetEnd] = useState(false);

  useEffect(() => {
    if (event) {
      const start = event.start instanceof Date ? event.start : new Date(event.start);
      const end = event.end instanceof Date ? event.end : new Date(event.end);
      setDate(start.toISOString().slice(0, 10));
      setStartTime(start.toISOString().slice(11, 16));
      setEndTime(end.toISOString().slice(11, 16));
      setUserSetEnd(false);
    }
  }, [event]);

  // Khi chỉnh startTime, endTime tự động +2h nếu user chưa chỉnh endTime
  const handleStartTimeChange = (val) => {
    setStartTime(val);
    if (!userSetEnd) {
      // Tự động +2h
      const [h, m] = val.split(":").map(Number);
      const endH = (h + 2) % 24;
      const endStr = `${endH.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
      setEndTime(endStr);
    }
  };

  // Khi chỉnh endTime, đánh dấu là user đã chỉnh
  const handleEndTimeChange = (val) => {
    setEndTime(val);
    setUserSetEnd(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      date: new Date(date).toISOString(),
      start_time: new Date(`${date}T${startTime}`).toISOString(),
      end_time: new Date(`${date}T${endTime}`).toISOString(),
    });
  };

  if (!open) return null;
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
        <h3 className="font-bold mb-4 text-2xl">Chỉnh sửa lịch học</h3>
        <div className="flex gap-4 mb-4">
          <label className="block flex-1">
            Ngày:
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="border rounded px-2 py-1 w-full"
              required
            />
          </label>
          <label className="block flex-1">
            Bắt đầu:
            <input
              type="time"
              value={startTime}
              onChange={e => handleStartTimeChange(e.target.value)}
              className="border rounded px-2 py-1 w-full"
              required
              min="00:00"
              max="23:59"
            />
          </label>
          <label className="block flex-1">
            Kết thúc:
            <input
              type="time"
              value={endTime}
              onChange={e => handleEndTimeChange(e.target.value)}
              className="border rounded px-2 py-1 w-full"
              required
              min="00:00"
              max="23:59"
            />
          </label>
        </div>
        <div className="flex gap-2 mt-4">
          <button type="submit" className="bg-indigo-700 text-white px-4 py-2 rounded">Lưu</button>
          <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>Hủy</button>
        </div>
      </form>
    </div>
  );
}