const Parameter = require("../models/parameter.model");

module.exports = async function validateVendingParameter(req, res, next) {
  try {
    const { parameter } = req.params;

    if (!parameter) {
      return res.status(400).json({
        message: "Parameter is required"
      });
    }

    const PAR = parameter.toUpperCase();

    const exists = await Parameter.findOne({
      module: "vending",
      parameter: PAR
    });

    if (!exists) {
      return res.status(400).json({
        message: "Invalid parameter"
      });
    }

    // normalize
    req.params.parameter = PAR;

    next();
  } catch (err) {
    console.error("validateVendingParameter error:", err);
    res.status(500).json({ message: "Validation failed" });
  }
};
