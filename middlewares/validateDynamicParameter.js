const Parameter = require("../models/parameter.model");

module.exports = async function validateDynamicParameter(req, res, next) {
  const { category, parameter } = req.params;

  console.log("🔍 VALIDATION CHECK:");
  console.log("module:", "coffee");
  console.log("category:", category);
  console.log("parameter:", parameter);

  const exists = await Parameter.findOne({
    module: "coffee",
    category: category.toUpperCase(),
    parameter: parameter.toUpperCase()
  });

  console.log("DB RESULT:", exists);

  if (!exists) {
    return res.status(400).json({
      message: "Invalid parameter for this module"
    });
  }

  next();
};
