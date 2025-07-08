const express = require('express');
const route = express.Router();
require('dotenv').config();

const Payment = require('../model/payment'); // Ensure this is correctly imported
const { sendConfirmationEmail, sendTicketEmail } = require('../utils/nodemailer');


// POST — Register a successful user
route.post('/register-success', async (req, res) => {
  try {
    const { fullname, email, age_range, creative_Background, ticket_bought, hear_us, join_us } = req.body;

    if (!fullname || !email) {
      return res.status(400).json({ message: 'Full name and email are required' });
    }

    const user = new Payment({
      fullname,
      email,
      age_range,
      creative_Background,
      ticket_bought,
      hear_us,
      join_us
    });

    await user.save();

    // ✉️ Send email confirmation
await sendConfirmationEmail(email, fullname);
await sendTicketEmail(email, fullname, './assets/spark.png');
    res.status(201).json({ message: 'Registration saved & email sent', data: user });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
});


// 2. GET — Retrieve all registered users
route.get('/all-users', async (req, res) => {
  try {
    const users = await Payment.find();
    res.status(200).json({ count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch users', error });
  }
});

// 3. GET — Retrieve a specific user by email
route.get('/user/:email', async (req, res) => {
  try {
    const user = await Payment.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
});

module.exports = route;
