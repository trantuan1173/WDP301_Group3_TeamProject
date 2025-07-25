import React, { useState } from "react";
import { API_ENDPOINTS } from "../../config";
import { FaUserEdit } from "react-icons/fa";

export default function GuestGetAdive() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", content: "" });
  const [emailError, setEmailError] = useState(""); // Thêm state lỗi

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (e.target.name === "email") {
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value);
      setEmailError(emailValid ? "" : "Email không đúng định dạng");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (emailError) return;

    try {
      const response = await fetch(API_ENDPOINTS.CREATE_CUSTOMER_CONSULTING, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Submit failed!");

      const data = await response.json();
      alert("Submit successfully!");
      setForm({ name: "", email: "", phone: "", content: "" });
      setEmailError("");
    } catch (error) {
      console.error("Submit failed!", error);
      alert("Submit failed!");
    }
  };

  return (
    <div className="pt-24 bg-white flex items-center justify-center">
      <div className="flex w-[1200px] w-10/12 bg-gradient-to-br from-[#eaf4fd] to-white p-14 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300">

        {/* Bên trái */}
        <div className="w-6/10 flex flex-col justify-center items-center">
          <img
            src="/images/CustomerConsulting2.png"
            alt="CustomerConsulting"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Bên phải: Form */}

        <form
          onSubmit={handleSubmit}
          className="w-4/10 bg-gradient-to-br from-orange-400 via-orange-500 to-red-400 rounded-3xl p-10 ml-8 flex flex-col justify-center shadow-lg transition-all duration-300"
        >
   
          <div className="flex justify-center items-center gap-2 mb-6">
            <FaUserEdit className="text-white text-2xl drop-shadow-md" />
            <div className="font-extrabold text-2xl text-white tracking-wide drop-shadow-md">
              GET ADVISE
            </div>
          </div>

         
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="mb-4 p-3 rounded-lg bg-white outline-none focus:ring-2 focus:ring-orange-300 transition duration-200"
            required
          />

        
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className={`mb-4 p-3 rounded-lg bg-white outline-none focus:ring-2 transition duration-200 ${emailError ? "ring-2 ring-red-400" : "focus:ring-orange-300"}`}
            required
          />

          
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="mb-4 p-3 rounded-lg bg-white outline-none focus:ring-2 focus:ring-orange-300 transition duration-200"
            required
          />

          
          <textarea
            name="content"
            placeholder="Message"
            value={form.content}
            onChange={handleChange}
            className="mb-4 p-3 rounded-lg bg-white outline-none focus:ring-2 focus:ring-orange-300 transition duration-200 min-h-[80px]"
            required
          />

          
          <div className="flex justify-between items-center mt-2">
            {emailError && (
              <p className="text-sm text-red-600 ml-1">{emailError}</p>
            )}
            <button
              type="submit"
              className="bg-white text-orange-500 font-bold px-8 py-2 rounded-full shadow-md hover:bg-orange-100 hover:scale-105 transition duration-300"
              disabled={!!emailError}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}