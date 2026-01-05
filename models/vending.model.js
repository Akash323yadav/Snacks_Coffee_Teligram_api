// models/vending.model.js
const mongoose = require("mongoose");

const vendingSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      default: "VENDING",
      uppercase: true
    },

    parameter: {
      type: String,
      required: true,
      uppercase: true,
      unique:true,
      index: true
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    video: {
      type: String // Telegram file_id
    },

    steps: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vending", vendingSchema);
