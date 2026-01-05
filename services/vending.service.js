const Vending = require("../models/vending.model");
const Parameter = require("../models/parameter.model");

// CREATE
exports.create = async (parameter, payload) => {
  //  DB validation (NO CONSTANTS)
  const exists = await Parameter.findOne({
    module: "vending",
    parameter
  });

  if (!exists) {
    throw new Error("Parameter not registered");
  }

  return await Vending.create({
    parameter,
    ...payload
  });
};

// GET
exports.get = async (parameter) => {
  return await Vending.findOne({ parameter });
};

// UPDATE
exports.update = async (parameter, payload) => {
  //  Optional but recommended
  const exists = await Parameter.findOne({
    module: "vending",
    parameter
  });

  if (!exists) {
    throw new Error("Parameter not registered");
  }

  return await Vending.findOneAndUpdate(
    { parameter },
    payload,
    { new: true }
  );
};
