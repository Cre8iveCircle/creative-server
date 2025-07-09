const express = require('express');
const route = express.Router();
require('dotenv').config();

const path = require('path');
const Payment = require('../model/payment');
const { sendConfirmationEmail, sendTicketEmail } = require('../utils/nodemailer');

// Ticket image path map (local file system)
const ticketImages = {
  '₦3,500': path.join(__dirname, '../ticket-assets/spark.png'),
  '₦10,000': path.join(__dirname, '../ticket-assets/vip.png'),
  '₦50,000': path.join(__dirname, '../ticket-assets/tech.png'),
  '₦100,000': path.join(__dirname, '../ticket-assets/digital.png'),
};

// POST — Register a successful user
route.post('/register-success', async (req, res) => {
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
      return res.status(400).json({ message: 'Full name and email are required' });
    }

    const user = new Payment({
      fullname,
      email,
      age_range,
      creative_Background,
      ticket_bought,
      hear_us,
      join_us,
    });

    await user.save();

    const ticketImagePath = ticketImages[ticket_bought] || path.join(__dirname, '../ticket-assets/default.png');
    console.log('🧾 Resolved Ticket Path:', ticketImagePath);

    await sendConfirmationEmail(email, fullname);
    await sendTicketEmail(email, fullname, ticketImagePath, ticket_bought);

    res.status(201).json({ message: 'Registration saved & email sent', data: user });
  } catch (error) {
    console.error('❌ Email Error:', error);
    res.status(500).json({ message: 'Something went wrong', error });
  }
});

// GET — All registered users
route.get('/all-users', async (req, res) => {
  try {
    const users = await Payment.find();
    res.status(200).json({ count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch users', error });
  }
});

// GET — Specific user by email
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
