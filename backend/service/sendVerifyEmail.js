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
    subject: "🔐 Verify your email address",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Hello,</h2>
        <p>Thank you for registering with us. Please verify your email address by clicking the button below:</p>
        <a href="${verifyLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
          Verify email
        </a>
        <p>If you did not register an account, please ignore this email.</p>
        <hr />
        <p style="font-size: 12px; color: #777;">You received this email because you registered at our system.</p>
        <p style="font-size: 12px; color: #777;">Company address: FPT University, District Hoa Lan, Ha Noi City</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendVerifyEmail;