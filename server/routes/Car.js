const express = require("express");
const { validateCarInput, addCar } = require("../middlewares/CarMiddlewares");
const router = express.Router();

// Express route
router.post('/add-car', validateCarInput, addCar);

//route to get all cars created by user
router.get("/my-cars")

module.exports = router;