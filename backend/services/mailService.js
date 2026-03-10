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

const toReadableLabel = (key) => {
  return String(key)
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (char) => char.toUpperCase());
};

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

const formatCurrency = (value) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return cleanValue(value);
  return `Rs. ${new Intl.NumberFormat("en-IN").format(numericValue)}`;
};

const sendMail = async (payload) => {
  const {
    email: to,
    pdf: pdfBase64,
    name,
    phone,
    sector,
    credits,
    low,
    high,
    sectorDetails = {}
  } = payload || {};

  const summaryRows = [
    ["Name", cleanValue(name)],
    ["Email", cleanValue(to)],
    ["Phone", cleanValue(phone)],
    ["Sector", cleanValue(sector)],
    ["Estimated Credits", cleanValue(credits)],
    ["Estimated Value (Low)", formatCurrency(low)],
    ["Estimated Value (High)", formatCurrency(high)]
  ];

  const detailEntries = Object.entries(sectorDetails).filter(([, value]) => cleanValue(value) !== "N/A");

  const summaryRowsHtml = summaryRows
    .map(([label, value]) => {
      return `<tr><td style="padding:8px;border:1px solid #d1d5db;font-weight:600">${escapeHtml(label)}</td><td style="padding:8px;border:1px solid #d1d5db">${escapeHtml(value)}</td></tr>`;
    })
    .join("");

  const detailRowsHtml = detailEntries
    .map(([key, value]) => {
      return `<tr><td style="padding:8px;border:1px solid #d1d5db;font-weight:600">${escapeHtml(toReadableLabel(key))}</td><td style="padding:8px;border:1px solid #d1d5db">${escapeHtml(cleanValue(value))}</td></tr>`;
    })
    .join("");

  const summaryText = summaryRows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const detailsText = detailEntries
    .map(([key, value]) => `${toReadableLabel(key)}: ${cleanValue(value)}`)
    .join("\n");

  const mailOptions = {
    from: "BlinkCarbon <digesh@thebytespark.com>",
    to: to,
    subject: "Carbon Credit Report",
    text:
      "Your carbon credit report is attached.\n\n" +
      summaryText +
      (detailsText ? `\n\nProject Details:\n${detailsText}` : ""),
    html:
      `<div style="font-family:Arial,sans-serif;line-height:1.5;color:#111827">` +
      `<h2 style="margin:0 0 10px;color:#166534">BlinkCarbon Carbon Credit Report</h2>` +
      `<p style="margin:0 0 14px">Your report is attached as a PDF. Summary is below:</p>` +
      `<table style="border-collapse:collapse;width:100%;margin-bottom:16px">${summaryRowsHtml}</table>` +
      (detailRowsHtml
        ? `<h3 style="margin:0 0 8px;color:#166534">Project Details</h3><table style="border-collapse:collapse;width:100%">${detailRowsHtml}</table>`
        : "") +
      `</div>`,
    attachments: [
      {
        filename: "report.pdf",
        content: pdfBase64,
        encoding: "base64"
      }
    ]
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendMail;
