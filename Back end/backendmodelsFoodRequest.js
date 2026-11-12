const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({

    requesterName: {
        type: String,
        required: true,
        trim: true
    },

    phone: {
        type: String,
        required: true
    },

    requiredFood: {
        type: String,
        required: true
    },

    requiredMeals: {
        type: Number,
        required: true,
        min: 1
    },

    deliveryLocation: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: [
            "Pending",
            "Approved",
            "Preparing",
            "Delivered",
            "Cancelled"
        ],
        default: "Pending"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("FoodRequest", requestSchema);