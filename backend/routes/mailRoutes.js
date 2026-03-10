const express = require("express");
const router = express.Router();
const sendMail = require("../services/mailService");

router.post("/send-report", async (req, res) => {

  try {

    const { email, pdf } = req.body || {};

    if (!email || !pdf) {
      return res.status(400).json({
        success: false,
        message: "Both email and pdf are required."
      });
    }

    const info = await sendMail(req.body);

    res.json({
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId || null
    });

  } catch (error) {

    console.log("Email sending failed:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Email sending failed"
    });

  }

});

module.exports = router;
