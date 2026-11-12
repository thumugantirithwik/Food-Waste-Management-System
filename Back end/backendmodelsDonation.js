const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({

    donorName: {
        type: String,
        required: true,
        trim: true
    },

    phone: {
        type: String,
        required: true
    },

    foodType: {
        type: String,
        required: true
    },

    quantity: {
        type: Number,
        required: true,
        min: 1
    },

    pickupLocation: {
        type: String,
        required: true
    },

    pickupDate: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: [
            "Pending",
            "Accepted",
            "Picked Up",
            "Delivered",
            "Cancelled"
        ],
        default: "Pending"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Donation", donationSchema);