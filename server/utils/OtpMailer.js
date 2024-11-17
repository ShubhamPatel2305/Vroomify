const sgMail = require('@sendgrid/mail');
dotenv = require('dotenv');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log(process.env.SENDGRID_API_KEY);

const sendOtpEmail = async (recipientEmail, otp, message) => {
    const msg = {
        to: recipientEmail,
        from: 'noreply.teamsync@gmail.com', 
        subject: 'Vroomify OTP Verification',
        text: `${message} ${otp}`,
        html: `<strong>${message} ${otp}</strong>`,
    };

    try {
        await sgMail.send(msg);
        console.log("Email sent successfully.");
    } catch (error) {
        console.error("Error sending email:", error.message);
    }
};

// Export the sendOtpEmail function for use in other parts of the application
module.exports = { sendOtpEmail };
