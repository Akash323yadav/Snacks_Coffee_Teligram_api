const Parameter = require("../models/parameter.model");

module.exports = async function validateCoffeeParameter(req, res, next) {
  try {
    const { category, parameter } = req.params;

    // 🛑 Safety check
    if (!category || !parameter) {
      return res.status(400).json({
        message: "Category and parameter are required"
      });
    }

    const CAT = category.toUpperCase();
    const PAR = parameter.toUpperCase();

    // 🔍 DB check (NO CONSTANTS)
    const exists = await Parameter.findOne({
      module: "coffee",
      category: CAT,
      parameter: PAR
    });

    if (!exists) {
      return res.status(400).json({
        message: "Invalid category or parameter"
      });
    }

    // normalize
    req.params.category = CAT;
    req.params.parameter = PAR;

    next();
  } catch (err) {
    console.error("validateCoffeeParameter error:", err);
    res.status(500).json({ message: "Validation failed" });
  }
};
