const express = require("express");
const { validateCarInput, addCar } = require("../middlewares/CarMiddlewares");
const router = express.Router();

// Express route
router.post('/add-car', validateCarInput, addCar);

module.exports = router;