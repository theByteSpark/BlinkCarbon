const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const cleanValue = (value) => {
  if (value === undefined || value === null) return "N/A";
  const stringValue = String(value).trim();
  return stringValue === "" ? "N/A" : stringValue;
};

const escapeHtml = (value) => {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const sendMail = async (payload) => {
  const {
    email: to,
    pdf: pdfBase64,
    name
  } = payload || {};
  const safeName = cleanValue(name);
  const generatedDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const mailOptions = {
    from: "BlinkCarbon <digesh@thebytespark.com>",
    to: to,
    subject: "Carbon Credit Report",
    text: `Hello ${safeName},

Thank you for using the BlinkCarbon Carbon Credit Calculator.

Your carbon credit estimation report has been generated on ${generatedDate} based on the project details you provided. The detailed report is attached to this email as a PDF.

If you would like to explore verified carbon credit opportunities, project registration, or market insights, our team would be happy to assist you.

Best regards,
BlinkCarbon Team
contact@blinkcarbon.com`,
    html:
      `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">` +
      `<p>Hello ${escapeHtml(safeName)},</p>` +
      `<p>Thank you for using the BlinkCarbon Carbon Credit Calculator.</p>` +
      `<p>Your carbon credit estimation report has been generated on ${escapeHtml(generatedDate)} based on the project details you provided. The detailed report is attached to this email as a PDF.</p>` +
      `<p>If you would like to explore verified carbon credit opportunities, project registration, or market insights, our team would be happy to assist you.</p>` +
      `<p>Best regards,<br/>BlinkCarbon Team <br/> <a href="mailto:contact@blinkcarbon.com">contact@blinkcarbon.com</a></p>` +
      `</div>`,
    attachments: [
      {
        filename: "Carbon Credit Estimation Report.pdf",
        content: pdfBase64,
        encoding: "base64"
      }
    ]
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendMail;
