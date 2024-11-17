const express = require("express");
const { validateCarInput, addCar, validateToken } = require("../middlewares/CarMiddlewares");
const router = express.Router();
require('dotenv').config();
const jwt= require('jsonwebtoken');
const { Car } = require("../db");

// Express route
router.post('/add-car', validateCarInput, addCar);

//route to get all cars created by user
router.get("/my-cars", validateToken, async (req,res)=>{
    try {
        const user=req.user;
        // Find all cars created by the authenticated user
        const cars = await Car.find({ created_by: user._id }).select('-__v'); // Excludes the `__v` field if it exists

        // Check if no cars were found
        if (!cars || cars.length === 0) {
            return res.status(403).json({ message: "No cars found" });
        }

        // Return the cars in the response
    return res.status(200).send(cars);
    } catch (error) {
        return res.status(500).json({message: "Error fetching cars"});
    }
})

module.exports = router;