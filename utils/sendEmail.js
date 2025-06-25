const nodemailer = require("nodemailer");

const sendEmail = (to, subject, html) => {
    return new Promise(async (resolve, reject) => {
        try {
            const transporter = nodemailer.createTransport({
                service: "gmail", // or Mailgun, etc.
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
                },
            });

            const info = await transporter.sendMail({
                from: `"Diariq" <${process.env.EMAIL_USER}>`,
                to,
                subject,
                html,
            });

            console.log(`✅ Email sent to ${to}: ${info.messageId}`);
            resolve({ success: true, messageId: info.messageId })
        } catch (error) {
            console.error(`❌ Failed to send email to ${to}:`, error.message);
            reject(error);
        }
    });
};

module.exports = sendEmail;
