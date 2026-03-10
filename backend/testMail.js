const nodemailer = require("nodemailer");
require("dotenv").config();

async function test() {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: '"BlinkCarbon Test" <test@blinkcarbon.com>',
    to: "Suvagiyadigesh1285@gmail.com",
    subject: "SMTP Test",
    text: "Brevo SMTP working successfully!",
  });

  console.log("Email sent:", info.messageId);
}

test();