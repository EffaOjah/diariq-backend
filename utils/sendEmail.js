const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: "gmail", // or Mailgun, etc.
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"Diariq" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
};

module.exports = sendEmail;
