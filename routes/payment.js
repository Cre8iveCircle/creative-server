const express = require("express");
const route = express.Router();
require("dotenv").config();

const Payment = require("../model/payment");

// POST — Register a successful user
route.post("/register-success", async (req, res) => {
    try {
        const {
            fullname,
            email,
            age_range,
            creative_Background,
            ticket_bought,
            hear_us,
            join_us,
        } = req.body;

        if (!fullname || !email) {
            return res.status(400).json({
                success: false,
                message: "Full name and email are required.",
            });
        }

        const user = await Payment.create({
            fullname,
            email,
            age_range,
            creative_Background,
            ticket_bought,
            hear_us,
            join_us,
        });

        return res.status(201).json({
            success: true,
            message: "Registration completed successfully.",
            data: user,
        });
    } catch (error) {
        console.error("Registration Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again later.",
        });
    }
});

// GET — All registered users
route.get("/all-users", async (req, res) => {
    try {
        const users = await Payment.find();

        return res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Could not fetch users.",
        });
    }
});

// GET — Specific user by email
route.get("/user/:email", async (req, res) => {
    try {
        const user = await Payment.findOne({
            email: req.params.email,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error retrieving user.",
        });
    }
});

module.exports = route;