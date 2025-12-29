// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      text
    });

    console.log('Email sent');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;
