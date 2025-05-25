import { useState } from "react";

export default function AdminEditAccount({ user,roles = [], onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    _id: user.id, 
    email: user.email,
    role: user.role,  
    profile: {
      name: user.name,
      phone: user.phone,
      dob: user.dob,
      gender: user.gender,
      address: user.address,
      imageURL: user.imageURL
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["name", "phone", "dob", "gender", "address"].includes(name)) {
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
    console.log("Dữ liệu gửi lên backend:", formData);
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <div
        className="flex-1 rounded shadow p-6 m-4 max-w-4xl bg-white"
        style={{
          border: "1px solid #D6BDBD",
          borderRadius: "10px",
          backgroundColor: "#FFFFFF",
        }}
      >
        <h3 className="text-xl font-semibold mb-6 text-center">Edit Account</h3>
        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <div>
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.profile.name}
              onChange={handleChange}
              placeholder="Full name"
              required
              className="w-full p-4"
              style={{
                border: "1px solid #D6BDBD",
                borderRadius: "10px",
                backgroundColor: "#EBF5FFC2",
              }}
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="w-full p-4 bg-gray-100 text-gray-500"
              style={{
                border: "1px solid #D6BDBD",
                borderRadius: "10px",
                backgroundColor: "#EBF5FFC2",
              }}
            />
          </div>
          <div>
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.profile.phone}
              onChange={handleChange}
              placeholder="Phone"
              required
              className="w-full p-4"
              style={{
                border: "1px solid #D6BDBD",
                borderRadius: "10px",
                backgroundColor: "#EBF5FFC2",
              }}
            />
          </div>
          <div>
            <label>Gender</label>
            <select
              name="gender"
              value={formData.profile.gender}
              onChange={handleChange}
              required
              className="w-full p-4"
              style={{
                border: "1px solid #D6BDBD",
                borderRadius: "10px",
                backgroundColor: "#EBF5FFC2",
              }}
            >
              <option value="" disabled>-- Select gender --</option>
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
            </select>
          </div>
          <div>
            <label>Birth Date</label>
            <input
              type="date"
              name="dob"
              value={formData.profile.dob}
              onChange={handleChange}
              required
              className="w-full p-4"
              style={{
                border: "1px solid #D6BDBD",
                borderRadius: "10px",
                backgroundColor: "#EBF5FFC2",
              }}
            />
          </div>
          <div>
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.profile.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full p-4"
              style={{
                border: "1px solid #D6BDBD",
                borderRadius: "10px",
                backgroundColor: "#EBF5FFC2",
              }}
            />
          </div>
          <div>
            <label>Role</label>
            <select
              name="role"
              value={formData.role._id}
              onChange={handleChange}
              required
              className="w-full p-4"
              style={{
                border: "1px solid #D6BDBD",
                borderRadius: "10px",
                backgroundColor: "#EBF5FFC2",
              }}
            >
              <option value="" disabled>-- Select role --</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.nameRole}
                </option>
              ))}
            </select>
          </div>
        </form>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded"
            onClick={handleSubmit}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
