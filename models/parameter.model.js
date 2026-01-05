const mongoose = require("mongoose");

const parameterSchema = new mongoose.Schema(
  {
    module: {
      type: String,
      required: true,
      lowercase: true,
      index: true
    },
    category: {
      type: String,
      uppercase: true,
      default: null
    },
    parameter: {
      type: String,
      required: true,
      uppercase: true
    },
    label: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

parameterSchema.index(
  { module: 1, category: 1, parameter: 1 },
  { unique: true }
);

module.exports = mongoose.model("Parameter", parameterSchema);
