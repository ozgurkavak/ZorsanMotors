"use server";

import { supabaseAdmin } from "@/lib/supabase";

export async function getContactMessages() {
    const { data, error } = await supabaseAdmin
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching messages:", error);
        return [];
    }
    return data || [];
}

export async function deleteMessage(id: string) {
    const { error } = await supabaseAdmin
        .from('contact_messages')
        .delete()
        .eq('id', id);

    if (error) throw error;
    return true;
}
