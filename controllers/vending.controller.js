const service = require("../services/vending.service");

// CREATE
exports.createVending = async (req, res) => {
  try {
    const { parameter } = req.params;

    const data = await service.create(
      parameter,
      req.body
    );

    res.status(201).json({
      message: "Vending data created successfully",
      data
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET
exports.getVending = async (req, res) => {
  const data = await service.get(req.params.parameter);

  if (!data) {
    return res.status(404).json({ message: "Data not found" });
  }

  res.json(data);
};

// UPDATE
exports.updateVending = async (req, res) => {
  try {
    const data = await service.update(
      req.params.parameter,
      req.body
    );

    res.json({
      message: "Vending data updated successfully",
      data
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
