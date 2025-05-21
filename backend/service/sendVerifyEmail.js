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
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email",
    text: `Please verify your email by clicking the link below: ${process.env.FRONTEND_URL}/verify/${token}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendVerifyEmail;

