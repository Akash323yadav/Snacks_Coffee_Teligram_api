const express = require("express");
const router = express.Router();
const validateVendingParameter = require("../middlewares/validateVendingParameter");
const vendingController = require("../controllers/vending.controller");

// TEST
router.get("/test", (req, res) => {
  res.send("Vending route working");
});

// CREATE
router.post(
  "/:parameter",
  validateVendingParameter,
  vendingController.createVending
);

// GET
router.get(
  "/:parameter",
  validateVendingParameter,
  vendingController.getVending
);

// UPDATE
router.put(
  "/:parameter",
  validateVendingParameter,
  vendingController.updateVending
);

module.exports = router;
