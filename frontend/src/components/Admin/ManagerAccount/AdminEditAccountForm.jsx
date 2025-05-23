import { useState } from "react";

export default function AdminEditAccount({ user, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    _id: user.id, 
    email: user.email,
    role: user.role,
    profile: {
      name: user.name || "",
      phone: user.phone || "",
      dob: user.dob || "",
      gender: user.gender || "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["name", "phone", "dob", "gender"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Chỉnh sửa tài khoản</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.profile.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Họ tên"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            readOnly
            className="w-full border px-3 py-2 rounded bg-gray-100 text-gray-500"
          />
          <select
            name="gender"
            value={formData.profile.gender}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">-- Chọn giới tính --</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
          <input
            type="date"
            name="dob"
            value={formData.profile.dob}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            name="phone"
            value={formData.profile.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Số điện thoại"
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">-- Chọn vai trò --</option>
            <option value="682989c63009eb573cbc1443">Học viên</option>
            <option value="682989e63009eb573cbc1444">Giáo viên</option>
          </select>
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
