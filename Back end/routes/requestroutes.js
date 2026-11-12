const express = require("express");
const FoodRequest = require("../models/FoodRequest");
const FoodDonation = require("../models/FoodDonation");

const router = express.Router();

// Request food
router.post("/request", async (req, res) => {
    try {
        const {
            foodId,
            requesterName,
            phone,
            quantityRequested
        } = req.body;

        const food = await FoodDonation.findById(foodId);

        if (!food) {
            return res.status(404).json({
                message: "Food donation not found"
            });
        }

        const request = new FoodRequest({
            foodId,
            requesterName,
            phone,
            quantityRequested
        });

        await request.save();

        res.status(201).json({
            message: "Food request submitted successfully",
            request
        });

    } catch (error) {
        res.status(500).json({
            message: "Food request failed",
            error: error.message
        });
    }
});

// Get all food requests
router.get("/all", async (req, res) => {
    try {
        const requests = await FoodRequest.find()
            .populate("foodId");

        res.status(200).json(requests);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get food requests",
            error: error.message
        });
    }
});

// Accept a food request
router.put("/accept/:id", async (req, res) => {
    try {
        const request = await FoodRequest.findByIdAndUpdate(
            req.params.id,
            { status: "Accepted" },
            { new: true }
        );

        if (!request) {
            return res.status(404).json({
                message: "Food request not found"
            });
        }

        res.status(200).json({
            message: "Food request accepted successfully",
            request
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to accept request",
            error: error.message
        });
    }
});

// Reject a food request
router.put("/reject/:id", async (req, res) => {
    try {
        const request = await FoodRequest.findByIdAndUpdate(
            req.params.id,
            { status: "Rejected" },
            { new: true }
        );

        if (!request) {
            return res.status(404).json({
                message: "Food request not found"
            });
        }

        res.status(200).json({
            message: "Food request rejected successfully",
            request
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to reject request",
            error: error.message
        });
    }
});

module.exports = router;