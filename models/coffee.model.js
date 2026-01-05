const mongoose = require("mongoose");

const coffeeSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      uppercase: true,
      index: true
    },

    parameter: {
      type: String,
      required: true,
      uppercase: true,
      index: true
    },

    title: { type: String, required: true },
    description: { type: String, required: true },
    video: { type: String }, // Telegram file_id
    steps: { type: [String], default: [] }
  },
  { timestamps: true }
);

// unique combination
coffeeSchema.index({ category: 1, parameter: 1 }, { unique: true });

module.exports = mongoose.model("Coffee", coffeeSchema);
