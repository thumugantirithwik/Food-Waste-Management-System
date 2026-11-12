const express = require("express");

const Donation = require("../models/Donation");

const router = express.Router();


// =============================
// CREATE DONATION
// =============================

router.post("/", async (req, res) => {

    try {

        const donation = new Donation({

            donorName: req.body.donorName,

            phone: req.body.phone,

            foodType: req.body.foodType,

            quantity: req.body.quantity,

            pickupLocation: req.body.pickupLocation,

            pickupDate: req.body.pickupDate

        });


        const savedDonation =
            await donation.save();


        res.status(201).json({

            message: "Donation submitted successfully",

            donation: savedDonation

        });

    }

    catch (error) {

        res.status(500).json({

            message: "Donation submission failed",

            error: error.message

        });

    }

});


// =============================
// GET ALL DONATIONS
// =============================

router.get("/", async (req, res) => {

    try {

        const donations =
            await Donation
                .find()
                .sort({ createdAt: -1 });


        res.json(donations);

    }

    catch (error) {

        res.status(500).json({

            message: "Could not fetch donations",

            error: error.message

        });

    }

});


// =============================
// GET SINGLE DONATION
// =============================

router.get("/:id", async (req, res) => {

    try {

        const donation =
            await Donation.findById(
                req.params.id
            );


        if (!donation) {

            return res.status(404).json({

                message: "Donation not found"

            });

        }


        res.json(donation);

    }

    catch (error) {

        res.status(500).json({

            message: "Error fetching donation",

            error: error.message

        });

    }

});


// =============================
// UPDATE DONATION STATUS
// =============================

router.put("/:id/status", async (req, res) => {

    try {

        const donation =
            await Donation.findByIdAndUpdate(

                req.params.id,

                {
                    status: req.body.status
                },

                {
                    new: true
                }

            );


        if (!donation) {

            return res.status(404).json({

                message: "Donation not found"

            });

        }


        res.json({

            message: "Donation status updated",

            donation

        });

    }

    catch (error) {

        res.status(500).json({

            message: "Status update failed",

            error: error.message

        });

    }

});


// =============================
// DELETE DONATION
// =============================

router.delete("/:id", async (req, res) => {

    try {

        const donation =
            await Donation.findByIdAndDelete(
                req.params.id
            );


        if (!donation) {

            return res.status(404).json({

                message: "Donation not found"

            });

        }


        res.json({

            message: "Donation deleted successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            message: "Delete failed",

            error: error.message

        });

    }

});


module.exports = router;