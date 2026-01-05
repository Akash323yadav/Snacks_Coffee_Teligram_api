const express = require("express");
const router = express.Router();
const Parameter = require("../models/parameter.model");

/* ===============================
   ADD PARAMETER
================================ */
router.post("/", async (req, res) => {
  try {
    const { module, category, parameter, label } = req.body;

    if (!module || !parameter || !label) {
      return res.status(400).json({
        message: "module, parameter and label are required"
      });
    }

    const data = await Parameter.create({
      module: module.toLowerCase(),
      category: category ? category.toUpperCase() : null,
      parameter: parameter.toUpperCase(),
      label
    });

    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ===============================
   GET ALL MODULES  FIRST
================================ */
router.get("/modules", async (req, res) => {
  try {
    const modules = await Parameter.distinct("module");
    res.json(modules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   GET CATEGORIES BY MODULE SECOND
================================ */
router.get("/categories/:module", async (req, res) => {
  try {
    const categories = await Parameter.distinct("category", {
      module: req.params.module.toLowerCase()
    });

    res.json(categories.filter(Boolean));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   GET PARAMETERS BY MODULE + CATEGORY  THIRD
================================ */
router.get("/:module/:category", async (req, res) => {
  try {
    const { module, category } = req.params;

    const params = await Parameter.find({
      module: module.toLowerCase(),
      category: category.toUpperCase()
    }).select("parameter label -_id");

    res.json(params);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   GET PARAMETERS BY MODULE ONLY  LAST
================================ */
router.get("/:module", async (req, res) => {
  try {
    const params = await Parameter.find({
      module: req.params.module.toLowerCase(),
      category: null
    }).select("parameter label -_id");

    res.json(params);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
