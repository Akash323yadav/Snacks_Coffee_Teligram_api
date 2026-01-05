const Coffee = require("../models/coffee.model");
const Parameter = require("../models/parameter.model");

// CREATE
exports.create = async (category, parameter, data) => {
  // 🔒 DB-level validation (NO CONSTANTS)
  const exists = await Parameter.findOne({
    module: "coffee",
    category,
    parameter
  });

  if (!exists) {
    throw new Error("Parameter not registered");
  }

  return await Coffee.create({
    category,
    parameter,
    ...data
  });
};

// GET
exports.get = async (category, parameter) => {
  return await Coffee.findOne({ category, parameter });
};

// UPDATE
exports.update = async (category, parameter, data) => {
  // 🔒 Optional but recommended
  const exists = await Parameter.findOne({
    module: "coffee",
    category,
    parameter
  });

  if (!exists) {
    throw new Error("Parameter not registered");
  }

  return await Coffee.findOneAndUpdate(
    { category, parameter },
    data,
    { new: true }
  );
};
