var nodemailer = require('nodemailer');
require('dotenv').config(); 

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: process.env.MAILER_NAME,
        pass: process.env.MAILER_PASSWORD
    }
});

async function sendEmail({ from, to, subject, html }) {
    await transporter.sendMail({ from, to, subject, html });
}

module.exports = sendEmail;