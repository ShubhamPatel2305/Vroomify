const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOtpEmail = async (recipientEmail, otp, message) => {
    const msg = {
        to: recipientEmail,
        from: 'noreply.teamsync@gmail.com', // Use the email address or domain you verified above
        subject: 'Vroomify OTP Verification',
        text: `${message}  ${otp}`,
        html: `<strong>${message}  ${otp}</strong>`,
      };
    
      sgMail.send(msg).then(res=>console.log("Email sent")).catch(err=>console.log(err.message));
};

// Export the sendOtpEmail function for use in other parts of the application
module.exports = { sendOtpEmail };
