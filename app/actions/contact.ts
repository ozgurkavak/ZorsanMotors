"use server";

import { z } from "zod";

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

    // In a real application, you would use an email provider here (Resend, SendGrid, etc.)
    // For now, we simulate sending by logging to the console.

    const emailContent = `
  --- NEW CONTACT MESSAGE ---
  To: sales@zorsanmotors.com
  From: ${firstName} ${lastName} <${email}>
  Phone: ${phone || "Not provided"}
  
  Message:
  ${message}
  ---------------------------
  `;

    console.log(emailContent);

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return { success: true, message: "Message sent successfully!" };
}
