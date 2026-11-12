const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const foodRoutes = require("./routes/foodRoutes");
const requestRoutes = require("./routes/requestRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/food", foodRoutes);
app.use("/api/requests", requestRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("Food Waste Management System Backend is Running!");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error);
    });

// Start server
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});