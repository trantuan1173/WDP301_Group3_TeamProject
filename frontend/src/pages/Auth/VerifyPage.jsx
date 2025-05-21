import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const VerifyPage = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("Đang xác minh...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.get(`http://localhost:9999/api/users/verify/${token}`);
        setMessage(res.data.message || "Xác minh thành công!");
      } catch (err) {
        setMessage("Xác minh thất bại hoặc token không hợp lệ.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#f0f2f5" }}>
      <div style={{
        padding: "2rem",
        backgroundColor: message.includes("thành công") ? "#d4edda" : "#f8d7da",
        color: message.includes("thành công") ? "#155724" : "#721c24",
        border: `1px solid ${message.includes("thành công") ? "#c3e6cb" : "#f5c6cb"}`,
        borderRadius: "8px",
        textAlign: "center",
        maxWidth: "400px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ marginBottom: "1.5rem" }}>{message}</h2>
        <button
          onClick={() => window.location.href = "/login"}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem",
            transition: "background-color 0.3s ease"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#007bff"}
        >
          Đến trang đăng nhập
        </button>
      </div>
    </div>
  );
};

export default VerifyPage;