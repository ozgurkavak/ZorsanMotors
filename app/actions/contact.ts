"use server";

import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import nodemailer from "nodemailer";

const contactSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function sendContactMessage(formData: FormData) {
    const rawData = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        message: formData.get("message"),
    };

    const validatedFields = contactSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { success: false, errors: validatedFields.error.flatten().fieldErrors };
    }

    const { firstName, lastName, email, phone, message } = validatedFields.data;

    // Save to Supabase Database
    try {
        const { error } = await supabaseAdmin
            .from('contact_messages')
            .insert({
                first_name: firstName,
                last_name: lastName,
                email,
                phone,
                message
            });

        if (error) {
            console.error("Supabase Error:", error);
            return { success: false, errors: { form: ["System error. Please contact support."] } };
        }
    } catch (err) {
        console.error("Unexpected error:", err);
        // Don't expose system errors to user, but log them
        return { success: false, errors: { form: ["Unexpected system error."] } };
    }

    // Send Email if SMTP is configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
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
                    rejectUnauthorized: false // Helps with some self-signed certs in dev
                }
            });

            const emailHtml = `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #000;">New Inquiry Received</h2>
                <hr/>
                <p><strong>From:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Phone:</strong> <a href="tel:${phone}">${phone || "N/A"}</a></p>
                <br/>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
                    <strong>Message:</strong><br/>
                    ${message.replace(/\n/g, '<br/>')}
                </div>
                <br/>
                <p style="font-size: 12px; color: #666;">This message was sent from Zorsan Motors website contact form.</p>
            </div>
          `;

            await transporter.sendMail({
                from: process.env.CONTACT_EMAIL_FROM || `"Zorsan Motors Web" <${process.env.SMTP_USER}>`,
                to: process.env.CONTACT_EMAIL_TO || "sales@zorsanmotors.com",
                subject: `New Inquiry: ${firstName} ${lastName}`,
                html: emailHtml,
                replyTo: email
            });

        } catch (emailError) {
            console.error("Failed to send email:", emailError);
        }
    } else {
        console.warn("SMTP credentials missing. Email skipped.");
    }

    return { success: true, message: "Message sent successfully!" };
}
