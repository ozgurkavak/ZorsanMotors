import nodemailer from "nodemailer";

interface EmailPayload {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: EmailPayload) {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
        console.warn("SMTP credentials missing. Email skipped.");
        return false;
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || "587"),
            secure: parseInt(process.env.SMTP_PORT || "587") === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        await transporter.sendMail({
            from: process.env.CONTACT_EMAIL_FROM || `"Zorsan Motors System" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });

        return true;
    } catch (error) {
        console.error("Failed to send email:", error);
        return false;
    }
}
