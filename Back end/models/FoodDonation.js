const mongoose = require("mongoose");

const foodDonationSchema = new mongoose.Schema({
    foodName: {
        type: String,
        required: true
    },

    quantity: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    location: {
        type: String,
        required: true
    },

    donorName: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: "Available"
    }
});

module.exports = mongoose.model("FoodDonation", foodDonationSchema);