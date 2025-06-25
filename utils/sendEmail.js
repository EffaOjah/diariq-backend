const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html, retries = 0, delay = 2000) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        },
    });

    for (let attempt = 1; attempt <= retries + 1; attempt++) {
        try {
            const info = await transporter.sendMail({
                from: `"Diariq" <${process.env.EMAIL_USER}>`,
                to,
                subject,
                html,
            });

            console.log(`✅ Email sent to ${to} (Attempt ${attempt}): ${info.messageId}`);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error(`❌ Attempt ${attempt} failed to send email to ${to}:`, error.message);

            if (attempt > retries) {
                return { success: false, error: error.message };
            }

            await new Promise((res) => setTimeout(res, delay)); // Wait before retrying
        }
    }
};

module.exports = sendEmail;