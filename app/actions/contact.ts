"use server";

import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";

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

    return { success: true, message: "Message sent successfully!" };
}
