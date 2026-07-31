const express = require('express');
const route = express.Router();
require('dotenv').config();

const path = require('path');
const Payment = require('../model/payment');
const { sendConfirmationEmail, sendTicketEmail } = require('../utils/nodemailer');

// Ticket image path map (local file system)
const ticketImages = {
    '₦3,500': path.join(__dirname, '../ticket-assets/spark.png'),
    '₦5,000': path.join(__dirname, '../ticket-assets/spark.png'),
    '₦3,500 (Free)': path.join(__dirname, '../ticket-assets/spark.png'), // 👈 ADD THIS LINE
    '₦10,000': path.join(__dirname, '../ticket-assets/vip.png'),
    '₦50,000': path.join(__dirname, '../ticket-assets/tech.png'),
    '₦100,000': path.join(__dirname, '../ticket-assets/digital.png'),
};


// POST — Register a successful user
route.post("/register-success", async (req, res) => {
    console.log("\n==================== NEW REGISTRATION ====================");
    console.log("📥 Incoming Request Body:");
    console.log(req.body);

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

        console.log("👤 Fullname:", fullname);
        console.log("📧 Email:", email);
        console.log("🎫 Ticket Bought:", ticket_bought);

        if (!fullname || !email) {
            console.log("❌ Validation failed: fullname or email missing");
            return res.status(400).json({
                message: "Full name and email are required",
            });
        }

        console.log("📝 Creating Payment document...");

        const user = new Payment({
            fullname,
            email,
            age_range,
            creative_Background,
            ticket_bought,
            hear_us,
            join_us,
        });

        console.log("💾 Saving user to MongoDB...");
        await user.save();
        console.log("✅ User saved successfully!");

        const ticketImagePath =
            ticketImages[ticket_bought] ||
            path.join(__dirname, "../ticket-assets/default.png");

        console.log("🧾 Ticket Path:", ticketImagePath);

        console.log("📧 Sending confirmation email...");
        await sendConfirmationEmail(email, fullname);
        console.log("✅ Confirmation email sent");

        console.log("🎟 Sending ticket email...");
        await sendTicketEmail(
            email,
            fullname,
            ticketImagePath,
            ticket_bought
        );
        console.log("✅ Ticket email sent");

        console.log("🎉 Registration completed successfully!");
        console.log("=========================================================\n");

        return res.status(201).json({
            message: "Registration saved & email sent",
            data: user,
        });
    } catch (error) {
        console.log("\n==================== REGISTRATION ERROR ====================");

        console.error("❌ Error Name:", error.name);
        console.error("❌ Error Message:", error.message);
        console.error("❌ Error Stack:");
        console.error(error.stack);

        if (error.response) {
            console.error("❌ Response:", error.response);
        }

        console.log("===========================================================\n");

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message,
        });
    }
});

//hu

// GET — All registered users
route.get('/all-users', async(req, res) => {
    try {
        const users = await Payment.find();
        res.status(200).json({ count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ message: 'Could not fetch users', error });
    }
});

// GET — Specific user by email
route.get('/user/:email', async(req, res) => {
    try {
        const user = await Payment.findOne({ email: req.params.email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ data: user });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error });
    }
});

module.exports = route;