const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();


// =============================
// MIDDLEWARE
// =============================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


// =============================
// ROUTES
// =============================

const authRoutes = require("./routes/auth");
const donationRoutes = require("./routes/donations");
const requestRoutes = require("./routes/requests");
const wasteRoutes = require("./routes/waste");


app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/waste", wasteRoutes);


// =============================
// HOME API
// =============================

app.get("/", (req, res) => {

    res.json({
        message: "Food Waste Management System Backend is running!",
        status: "success"
    });

});


// =============================
// DATABASE
// =============================

mongoose.connect(process.env.MONGO_URI)

    .then(() => {

        console.log("MongoDB connected successfully");

        app.listen(process.env.PORT || 5000, () => {

            console.log(
                `Server running on http://localhost:${process.env.PORT || 5000}`
            );

        });

    })

    .catch((error) => {

        console.error("MongoDB connection failed:");

        console.error(error.message);

    });