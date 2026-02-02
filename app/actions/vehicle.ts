"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { Vehicle } from "@/types";
import { revalidatePath } from "next/cache";

export async function addVehicleAction(vehicle: any) {
    const { data, error } = await supabaseAdmin
        .from('vehicles')
        .insert([vehicle])
        .select()
        .single();

    if (error) {
        console.error("Server Action addVehicle Error:", error);
        throw new Error(error.message);
    }

    revalidatePath('/inventory');
    revalidatePath('/admin/inventory');
    revalidatePath('/zm-console/inventory');
    revalidatePath('/zm-console');
    return data;
}

export async function deleteVehicleAction(id: string) {
    const { error } = await supabaseAdmin
        .from('vehicles')
        .delete()
        .eq('id', id);

    if (error) {
        console.error("Server Action deleteVehicle Error:", error);
        throw new Error(error.message);
    }

    revalidatePath('/inventory');
    revalidatePath('/zm-console/inventory');
}

export async function updateVehicleAction(id: string, updates: Partial<Vehicle>) {
    // Map frontend keys to DB keys if necessary, but we are passing prepared object usually.
    // However, vehicle-context was passing partial object.
    // For update, we might need manual mapping if keys differ.
    // The context was mapping: status, price. 
    // EditDialog passes: make, model, year, price, mileage, vin, status, image, condition.
    // DB keys: make, model, year, price, mileage, vin, status, image_url, condition (not in DB yet maybe?), exterior_color, interior_color.

    // Let's implement a mapper here or expect mapped input.
    // To be safe, let's map here.

    const dbUpdates: any = {};
    if (updates.make) dbUpdates.make = updates.make;
    if (updates.model) dbUpdates.model = updates.model;
    if (updates.year) dbUpdates.year = updates.year;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.mileage !== undefined) dbUpdates.mileage = updates.mileage;
    if (updates.vin) dbUpdates.vin = updates.vin;
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.image) dbUpdates.image_url = updates.image;
    if (updates.bodyType) dbUpdates.body_type = updates.bodyType;
    if (updates.fuelType) dbUpdates.fuel_type = updates.fuelType;
    if (updates.exteriorColor) dbUpdates.exterior_color = updates.exteriorColor;
    if (updates.interiorColor) dbUpdates.interior_color = updates.interiorColor;
    if (updates.images) dbUpdates.images = updates.images;

    // DMS Fields
    if (updates.purchasePrice !== undefined) dbUpdates.purchase_price = updates.purchasePrice;
    if (updates.salePrice !== undefined) dbUpdates.sale_price = updates.salePrice;
    if (updates.soldDate !== undefined) dbUpdates.sold_date = updates.soldDate;
    if (updates.stockNumber) dbUpdates.stock_number = updates.stockNumber;
    // Add others as needed

    const { error } = await supabaseAdmin
        .from('vehicles')
        .update(dbUpdates)
        .eq('id', id);

    if (error) {
        console.error("Server Action updateVehicle Error:", error);
        throw new Error(error.message);
    }

    revalidatePath('/inventory');
    revalidatePath('/zm-console/inventory');
    revalidatePath('/zm-console');
}
