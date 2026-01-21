"use server";

import { cookies } from "next/headers";

export async function loginAction(password: string) {
    const correctPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (password === correctPassword) {
        // In a real app, use a secure session library
        (await cookies()).set("admin_session", "true", {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600
        });
        return { success: true };
    }

    return { success: false };
}
