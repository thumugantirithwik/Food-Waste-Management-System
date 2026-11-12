const mongoose = require("mongoose");

const foodRequestSchema = new mongoose.Schema({
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FoodDonation",
        required: true
    },

    requesterName: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    quantityRequested: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: "Pending"
    }
});

module.exports = mongoose.model("FoodRequest", foodRequestSchema);