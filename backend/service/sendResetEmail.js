const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const sendResetEmail = async (email, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Support Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🔐 Đặt lại mật khẩu của bạn",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Xin chào,</h2>
        <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhấn vào nút bên dưới để đặt mật khẩu mới. Liên kết này sẽ hết hạn sau 15 phút.</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
          Đặt lại mật khẩu
        </a>
        <p>Nếu bạn không yêu cầu thay đổi mật khẩu, hãy bỏ qua email này.</p>
        <hr />
        <p style="font-size: 12px; color: #777;">Bạn nhận được email này vì đã yêu cầu đặt lại mật khẩu tại hệ thống của chúng tôi.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendResetEmail;
