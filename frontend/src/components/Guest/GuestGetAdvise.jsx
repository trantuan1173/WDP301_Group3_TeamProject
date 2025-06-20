import React, { useState } from "react";

export default function GuestGetAdive() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý gửi dữ liệu ở đây
    alert("Đã gửi thông tin tư vấn!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex w-[1200px] bg-[#eaf4fd] p-14 rounded-lg shadow">
        {/* Bên trái */}
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="font-bold text-lg mb-6 text-black text-center w-full">
            NHẬN TƯ VẤN LỘ TRÌNH MIỄN PHÍ
          </div>
          <button
            className="bg-orange-500 text-white font-bold text-xl px-12 py-3 rounded-xl shadow hover:bg-orange-600 transition"
          >
            TẠI ĐÂY
          </button>
        </div>
        {/* Bên phải */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 bg-orange-500 rounded-2xl p-8 ml-8 flex flex-col justify-center shadow"
        >
          <input
            type="text"
            name="name"
            placeholder="Họ và tên"
            value={form.name}
            onChange={handleChange}
            className="mb-4 p-3 rounded bg-white outline-none"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="mb-4 p-3 rounded bg-white outline-none"
            required
          />
          <textarea
            name="message"
            placeholder="Nội dung"
            value={form.message}
            onChange={handleChange}
            className="mb-4 p-3 rounded bg-white outline-none min-h-[80px]"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-white text-orange-500 font-bold px-8 py-2 rounded shadow hover:bg-gray-100 transition"
            >
              Gửi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}