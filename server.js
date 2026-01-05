require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

/* =========================
   BODY PARSERS
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   STATIC FILES (UI)
========================= */
app.use(express.static(path.join(__dirname, "public")));

/* =========================
   API ROUTES
========================= */
app.use("/api/parameters", require("./routes/parameter.routes"));
app.use("/api/coffee", require("./routes/coffee.routes"));
app.use("/api/vending", require("./routes/vending.routes"));
app.use("/api/upload", require("./routes/upload.routes"));

/* =========================
   UI ROUTE
========================= */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "video_upload.html"));
});

/* =========================
   JSON ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON format" });
  }
  next(err);
});

/* =========================
   DATABASE CONNECTION
========================= */
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connected"))
  .catch(err => console.error("DB Error:", err));

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
