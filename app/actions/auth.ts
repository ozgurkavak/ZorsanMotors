"use server";

import { cookies } from "next/headers";

export async function loginAction(password: string) {
    const correctPassword = process.env.ADMIN_PASSWORD;

    if (!correctPassword) {
        console.error("ADMIN_PASSWORD environment variable is not set.");
        return { success: false };
    }


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
export async function logoutAction() {
    (await cookies()).delete("admin_session");
    return { success: true };
}
