const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

// =======================
// MULTER CONFIG
// =======================
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 200 * 1024 * 1024 } // server side only
});

const TELEGRAM_LIMIT = 50 * 1024 * 1024; // ~50MB

// =======================
// TELEGRAM VIDEO FUNCTION
// =======================
async function sendVideoToTelegram(filePath) {
  const form = new FormData();
  form.append("chat_id", process.env.ADMIN_CHAT_ID);
  form.append("video", fs.createReadStream(filePath)); // ✅ sendVideo

  const res = await axios.post(
    `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendVideo`,
    form,
    {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
      maxContentLength: Infinity
    }
  );

  return res.data;
}

// =======================
// UPLOAD API
// =======================
router.post("/video", upload.single("video"), async (req, res) => {
  console.log("UPLOAD ROUTE HIT");

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file received"
      });
    }

    const sizeMB = (req.file.size / 1024 / 1024).toFixed(2);
    console.log("File size:", sizeMB, "MB");

    // 🚫 Telegram bot hard limit
    if (req.file.size > TELEGRAM_LIMIT) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({
        success: false,
        error: "Video too large for Telegram playback (max ~50MB)"
      });
    }

    // ✅ Send playable video
    const tgRes = await sendVideoToTelegram(req.file.path);

    fs.unlink(req.file.path, () => {});

    return res.json({
      success: true,
      fileId: tgRes.result.video.file_id
    });

  } catch (err) {
    console.error("Telegram Error:", err.response?.data || err.message);

    return res.status(500).json({
      success: false,
      error:
        err.response?.data?.description ||
        err.message ||
        "Telegram upload failed"
    });
  }
});

module.exports = router;
