import { useState } from "react";

export default function AdminAddAccount({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    gender: "",
    phone: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay nền mờ */}
      <div
        className="absolute inset-0 bg-black opacity-40"
        onClick={onClose} // click ra ngoài để đóng form
      ></div>

      {/* Form popup */}
      <div className="relative z-10 bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-center text-xl font-bold text-[#120B48] mb-4">
          Tạo tài khoản
        </h2>
        <form className="space-y-3">
          <input type="text" placeholder="Họ và tên" className="w-full border px-3 py-2 rounded" />
          <input type="email" placeholder="Email" className="w-full border px-3 py-2 rounded" />
          <input type="date" placeholder="Ngày sinh" className="w-full border px-3 py-2 rounded" />
          <input type="text" placeholder="Giới tính" className="w-full border px-3 py-2 rounded" />
          <input type="text" placeholder="Số điện thoại" className="w-full border px-3 py-2 rounded" />
          <input type="password" placeholder="Mật khẩu" className="w-full border px-3 py-2 rounded" />
          <select className="w-full border px-3 py-2 rounded">
            <option value="">Chọn vai trò</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 text-black"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-indigo-600 text-white"
            >
              Tạo tài khoản
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
