const express = require("express");
const { validateCarInput, addCar, validateToken, getCarMiddleware, editCarDetails, updateCarImages } = require("../middlewares/CarMiddlewares");
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
});

//get car by id in req params 
router.get("/:id",validateToken,getCarMiddleware, async (req, res) => {
    try {
        req.car.name=req.userName;
        return res.status(200).json(req.car);
    } catch (error) {
        return res.status(500).json({message: "Error fetching car"});
    }
});

router.delete("/delete/:id",validateToken,async (req,res)=>{
    try {
        const uid=req.userId.toString();
        const carId=req.params.id;
        const car=await Car.findById(carId);
        if(!car) return res.status(403).json({message: "Car not found"});
        if(car.created_by.toString()!==uid) return res.status(405).json({message:"Access denied"});
        await Car.deleteOne({_id:car._id});
        return res.status(200).json({message: "Car deleted successfully"});
    } catch (error) {
        return res.status(500).json({message: "Error deleting car"});
    }
})

//route to edit car details except images
router.put("/edit-details",validateToken,editCarDetails);

router.put("/edit-images",validateToken, updateCarImages );

module.exports = router;