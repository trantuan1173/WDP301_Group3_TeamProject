import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../assets/CSS/MinhKhanhCSS.css";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const VerifyPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
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
    <div>
      <div className="verifypage-container-main">
        <h1>{message}</h1>

        <div className="verifypage-logo-for-loading">
          <img
            src="/images/logo.png"
            alt="Logo"
            className={message === "Đang xác minh..." ? "spin" : ""}
          />
        </div>

        <div className="verify-login-button-wrapper">
          <button
            className="verify-login-button"
            onClick={() => navigate("/login")} >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>

  );
};

export default VerifyPage;
