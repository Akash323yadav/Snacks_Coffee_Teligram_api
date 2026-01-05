const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  module: String,
  category: String,
  parameter: String,
  title: String,
  description: String,
  steps: [String],
  video: String
});

schema.index(
  { module: 1, category: 1, parameter: 1 },
  { unique: true }
);

module.exports = mongoose.model("Content", schema);
