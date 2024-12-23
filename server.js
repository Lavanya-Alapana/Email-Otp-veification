const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const OTP = require('./model'); // Adjust the path if necessary
require('dotenv').config();

// MongoDB Connection
mongoose
    .connect('mongodb+srv://Lavanya:lavanya*123@cluster0.xcdrg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('DB connected successfully'))
    .catch((err) => console.error('DB connection error:', err));

const app = express();
const cors = require('cors');
app.use(cors());

// Middleware
app.use(bodyParser.json());

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Set this in your environment
        pass: process.env.EMAIL_PASS, // Use an App Password or a secure token
    },
});

// Utility: Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Test Endpoint
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Generate and Send OTP
app.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
  
    const otp = generateOTP();
    console.log('Generated OTP:', otp);
  
    try {
      const updatedOtp = await OTP.findOneAndUpdate(
        { email },
        { otp, createdAt: new Date() },
        { upsert: true, new: true }
      );
  
      console.log('OTP saved:', updatedOtp);
  
      transporter.sendMail(
        {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Your OTP Code',
          text: `Your OTP is: ${otp}`,
        },
        (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ error: 'Error sending email' });
          }
          console.log('Email sent:', info.response);
          res.status(200).json({ message: 'OTP sent successfully' });
        }
      );
    } catch (error) {
      console.error('Error during OTP generation:', error);
      res.status(500).json({ error: 'Error generating OTP' });
    }
  });
  
// Verify OTP
app.post('/verify-otp', async (req, res) => {
    console.log('Request received at /verify-otp:', req.body);

    const { email, otp } = req.body;

    if (!email || !otp) {
        console.log('Missing email or OTP');
        return res.status(400).send('Email and OTP are required');
    }

    try {
        const record = await OTP.findOne({ email, otp });
        if (!record) {
            console.log('Invalid or expired OTP for email:', email);
            return res.status(400).send('OTP has expired or is invalid');
        }

        // OTP is valid; delete it
        await OTP.deleteOne({ _id: record._id });
        console.log('OTP verified and deleted for email:', email);
        res.send('OTP verified successfully');
    } catch (err) {
        console.error('Error during OTP verification:', err);
        res.status(500).send('Error verifying OTP');
    }
});

// Start Server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
