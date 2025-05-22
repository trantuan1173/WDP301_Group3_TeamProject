const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const sendVerifyEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const verifyLink = `${process.env.FRONTEND_URL}/verify/${token}`;

  const mailOptions = {
    from: `"Support Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🔐 Xác minh địa chỉ email của bạn",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Chào bạn,</h2>
        <p>Cảm ơn bạn đã đăng ký tài khoản với chúng tôi. Vui lòng xác minh địa chỉ email của bạn bằng cách nhấn vào nút bên dưới:</p>
        <a href="${verifyLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
          Xác minh email
        </a>
        <p>Nếu bạn không đăng ký tài khoản, vui lòng bỏ qua email này.</p>
        <hr />
        <p style="font-size: 12px; color: #777;">Bạn nhận được email này vì đã đăng ký tại hệ thống của chúng tôi.</p>
        <p style="font-size: 12px; color: #777;">Địa chỉ công ty: 123 Đường ABC, Quận XYZ, TP.HCM</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendVerifyEmail;