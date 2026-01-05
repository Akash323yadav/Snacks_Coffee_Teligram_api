const service = require("../services/coffee.service");

// CREATE
exports.createCoffee = async (req, res) => {
  try {
    const { category, parameter } = req.params;

    const data = await service.create(
      category,
      parameter,
      req.body
    );

    return res.status(201).json({
      message: "Coffee data created successfully",
      data
    });
  } catch (err) {
    console.error("Create coffee error:", err.message);

    // ❌ validation / business error
    if (err.message === "Parameter not registered") {
      return res.status(400).json({ message: err.message });
    }

    // ❌ unexpected server error
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET
exports.getCoffee = async (req, res) => {
  try {
    const { category, parameter } = req.params;

    const data = await service.get(category, parameter);

    if (!data) {
      return res.status(404).json({
        message: "Coffee data not found"
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Get coffee error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE
exports.updateCoffee = async (req, res) => {
  try {
    const { category, parameter } = req.params;

    const data = await service.update(
      category,
      parameter,
      req.body
    );

    if (!data) {
      return res.status(404).json({
        message: "Coffee data not found"
      });
    }

    return res.status(200).json({
      message: "Coffee data updated successfully",
      data
    });
  } catch (err) {
    console.error("Update coffee error:", err.message);

    if (err.message === "Parameter not registered") {
      return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};
