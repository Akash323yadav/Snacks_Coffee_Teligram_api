const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const Content = require("../models/content.model");

const upload = multer({ dest: "uploads/" });

router.post("/:module/:category?/:parameter", upload.single("video"), async (req, res) => {
  try {
    const { module, category, parameter } = req.params;

    const payload = {
      module,
      category: category || null,
      parameter,
      title: req.body.title,
      description: req.body.description,
      steps: JSON.parse(req.body.steps || "[]")
    };

    // ✅ Upload video to Telegram → file_id generate
    if (req.file) {
      const form = new FormData();
      form.append("chat_id", process.env.ADMIN_CHAT_ID);
      form.append("video", fs.createReadStream(req.file.path));

      const tgRes = await axios.post(
        `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendVideo`,
        form,
        { headers: form.getHeaders() }
      );

      payload.video = tgRes.data.result.video.file_id;

      // 🧹 delete temp file
      fs.unlinkSync(req.file.path);
    }

    //  POST + PUT (upsert)
    const data = await Content.findOneAndUpdate(
      { module, category: category || null, parameter },
      payload,
      { upsert: true, new: true }
    );

    res.json({ success: true, data });

  } catch (err) {
    console.error(" Upload Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
