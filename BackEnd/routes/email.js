// routes/email.js
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/send", async (req, res) => {
  const { to, subject, message } = req.body;
  console.log("Request received", req.body);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // الإيميل اللي بدك ترسلي منه
      pass: process.env.EMAIL_PASS, // app password مش الباسورد العادي
    },
  });

  try {
    await transporter.sendMail({
      from: `"GlamBook" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: message,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
