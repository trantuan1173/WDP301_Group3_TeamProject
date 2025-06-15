import React, { useState, useEffect } from "react";

export default function AdminUpdateSheduleForm({ open, onClose, event, onSave }) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (event) {
      setDate(event.start.toISOString().slice(0, 10));
      setStartTime(event.start.toISOString().slice(11, 16));
      setEndTime(event.end.toISOString().slice(11, 16));
    }
  }, [event]);

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
      style={{ background: "rgba(0,0,0,0.4)" }} // overlay nhẹ hơn
      onClick={onClose}
    >
      <form
        className="bg-white p-6 rounded shadow-md min-w-[300px]"
        onClick={e => e.stopPropagation()} // ngăn nổi bọt
        onSubmit={handleSubmit}
      >
        <h3 className="font-bold mb-4 text-2xl">Chỉnh sửa lịch học</h3>
        <div className="flex gap-4 mb-4">
          <label className="block flex-1">
            Ngày:
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border rounded px-2 py-1 w-full" required />
          </label>
          <label className="block flex-1">
            Bắt đầu:
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="border rounded px-2 py-1 w-full" required />
          </label>
          <label className="block flex-1">
            Kết thúc:
            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="border rounded px-2 py-1 w-full" required />
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