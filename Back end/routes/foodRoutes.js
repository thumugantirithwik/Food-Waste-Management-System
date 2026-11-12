const express = require("express");
const FoodDonation = require("../models/FoodDonation");

const router = express.Router();

// Add a food donation
router.post("/donate", async (req, res) => {
    try {
        const {
            foodName,
            quantity,
            description,
            location,
            donorName,
            phone
        } = req.body;

        const donation = new FoodDonation({
            foodName,
            quantity,
            description,
            location,
            donorName,
            phone
        });

        await donation.save();

        res.status(201).json({
            message: "Food donation added successfully",
            donation
        });

    } catch (error) {
        res.status(500).json({
            message: "Food donation failed",
            error: error.message
        });
    }
});

// Get all available food donations
router.get("/available", async (req, res) => {
    try {
        const donations = await FoodDonation.find({
            status: "Available"
        });

        res.status(200).json(donations);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get donations",
            error: error.message
        });
    }
});

module.exports = router;