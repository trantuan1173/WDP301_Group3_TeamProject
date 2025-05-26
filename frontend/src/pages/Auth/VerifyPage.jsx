import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../assets/CSS/MinhKhanhCSS.css";
import { Container } from "react-bootstrap";
import {API_ENDPOINTS} from "../../config";
import { useNavigate } from "react-router-dom";

const VerifyPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Đang xác minh...");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.REGISTER_VERIFY_EMAIL(token));
        setMessage(res.data.message || "Xác minh thành công!");
      } catch (err) {
        setMessage("Xác minh thất bại hoặc token không hợp lệ. Vui lòng nhập email để gửi lại mã xác minh");
        setError(true);
      }
    };

    verifyEmail();
  }, [token]);

  const handleResendVerifyEmail = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API_ENDPOINTS.RESEND_VERIFY_EMAIL, { email });
      setMessage(res.data.message || "Mã xác minh đã được gửi lại!");
    } catch (err) {
      setMessage("Gửi thất bại. Vui lòng thử lại.");
      setError(err.response.data.message);
    }
  };

  return (
    <div>
      {error ? (
        <div className="verifypage-container-main">
          <h1>{message}</h1>
          <p className="text-red-500">{error}</p>
          <form onSubmit={handleResendVerifyEmail}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit">Gửi lại mã xác minh</button>
          </form>
        </div>
      ) : (
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
      )}
    </div>

  );
};

export default VerifyPage;
