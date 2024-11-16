const formData = require('form-data');
const Mailgun = require('mailgun.js');
require('dotenv').config();

// Initialize Mailgun client
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });

/**
 * Send OTP email using Mailgun
 * @param {string} recipientEmail - The email address of the recipient
 * @param {string} otp - The one-time password to send
 * @param {string} message - Custom message to include with the OTP
 * @returns {Promise<void>}
 */
const sendOtpEmail = async (recipientEmail, otp, message) => {
    try {
        const data = {
            from: 'Excited User <mailgun@sandbox58049ebfe17044809fd80e9f065cfcdd.mailgun.org>', 
            to: recipientEmail,
            subject: 'Your OTP Code',
            text: `${message}: ${otp}`,
            html: `<p>${message}: <strong>${otp}</strong></p>`,
        };

        // Send the email
        const response = await mg.messages.create('sandbox-123.mailgun.org', data); 
        console.log('Email sent successfully:', response);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email.');
    }
};

// Export the sendOtpEmail function for use in other parts of the application
module.exports = { sendOtpEmail };
