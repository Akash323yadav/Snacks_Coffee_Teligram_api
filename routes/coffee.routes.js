const router = require("express").Router();
const controller = require("../controllers/coffee.controller");
const validateCoffeeParameter = require("../middlewares/validateCoffeeParameter");

// CREATE
router.post(
  "/:category/:parameter",
  validateCoffeeParameter,
  controller.createCoffee
);

// GET
router.get(
  "/:category/:parameter",
  validateCoffeeParameter,
  controller.getCoffee
);

// UPDATE
router.put(
  "/:category/:parameter",
  validateCoffeeParameter,
  controller.updateCoffee
);

module.exports = router;
