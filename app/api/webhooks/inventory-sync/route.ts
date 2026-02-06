import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/email';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Must use Service Role Key to bypass RLS for logs if needed

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
    try {
        // 1. Security Check
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.INVENTORY_SYNC_TOKEN}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Parse Body (Expect JSON data from the VPS script)
        const body = await request.json();

        // --- HEARTBEAT CHECK ---
        if (body.type === 'HEARTBEAT') {
            const { error } = await supabase.from('sync_heartbeats').insert({ status: 'ALIVE' });
            if (error) console.error("Heartbeat error:", error);
            return NextResponse.json({ success: true, message: 'Heartbeat received' });
        }

        // --- STATUS UPDATE (V7 Feature) ---
        if (body.type === 'STATUS_UPDATE') {
            const { status, message } = body;

            // Log the status
            await supabase.from('sync_logs').insert({
                event_type: status === 'FAILED' ? 'SYNC_ERROR' : 'SYNC_STATUS',
                message: message,
                details: { status }
            });

            // Send Email on Failure
            if (status === 'FAILED') {
                await sendEmail({
                    to: 'sales@zorsanmotors.com',
                    subject: '🚨 URGENT: Inventory Sync Critical Failure',
                    html: `
                    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                        <h2 style="color: #ef4444;">Sync Operation Failed</h2>
                        <p>The system has exhausted all retry attempts and failed to process the inventory file.</p>
                        
                        <div style="background: #fef2f2; padding: 15px; border-radius: 6px; border-left: 4px solid #ef4444; margin: 20px 0;">
                            <strong>Error Details:</strong><br/>
                            <code>${message}</code>
                        </div>

                        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                        <p>Please check the file on the FTP server manually.</p>
                    </div>
                `
                });
            }

            return NextResponse.json({ success: true, message: 'Status recorded' });
        }
        // -----------------------

        const { vehicles } = body;

        if (!Array.isArray(vehicles)) {
            return NextResponse.json({ error: 'Invalid data format. "vehicles" array required.' }, { status: 400 });
        }

        console.log(`Received ${vehicles.length} vehicles for sync.`);

        // 3. Sync Logic (Upsert based on VIN)
        const dbVehicles = vehicles.map((v: any) => ({
            vin: v.vin,
            stock_number: v.stockNumber, // Map camelCase to snake_case
            year: v.year,
            make: v.make,
            model: v.model,
            price: v.price,
            mileage: v.mileage,
            body_type: v.bodyType || "Other", // Default if missing
            fuel_type: v.fuelType || "Gasoline", // Default if missing
            transmission: v.transmission || "Automatic", // Default if missing
            image_url: v.image || null,
            images: v.images || [],
            description: v.description || "",
            // condition: v.mileage < 1000 ? "New" : "Used", // Removed to fix DB Schema Error
            exterior_color: v.exteriorColor || "Unknown",
            interior_color: v.interiorColor || "Unknown",
            features: v.features || null,
            updated_at: new Date().toISOString()
        }));

        const { error: upsertError } = await supabase
            .from('vehicles')
            .upsert(dbVehicles, { onConflict: 'vin' });

        if (upsertError) {
            throw new Error(`Database Upsert Failed: ${upsertError.message}`);
        }



        // 3.5. Mark Missing Vehicles as 'Sold' (Snapshot Strategy)
        let soldCount = 0;
        // Only run this logic if we received a reasonable amount of data (Safety Guard)
        if (vehicles.length >= 5) {
            try {
                const incomingVins = vehicles.map((v: any) => v.vin);

                // Fetch currently available VINs
                const { data: availableVehicles } = await supabase
                    .from('vehicles')
                    .select('vin')
                    .eq('status', 'Available');

                if (availableVehicles) {
                    const missingVins = availableVehicles
                        .map(v => v.vin)
                        .filter(vin => !incomingVins.includes(vin));

                    if (missingVins.length > 0) {
                        soldCount = missingVins.length;
                        console.log(`Snapshot Sync: Marking ${soldCount} vehicles as Sold (Missing from Feed).`);

                        await supabase
                            .from('vehicles')
                            .update({
                                status: 'Sold',
                                sold_date: new Date().toISOString()
                            })
                            .in('vin', missingVins);
                    }
                }
            } catch (soldLogicError) {
                console.error("Critical error in Sold Logic:", soldLogicError);
            }
        } else {
            console.warn("Skipping 'Sold' detection: Feed contains fewer than 5 vehicles. Potential feed error.");
        }

        // 4. Log Success with Enhanced Details
        const meta = body.meta || {}; // Get V6 meta stats

        await supabase.from('sync_logs').insert({
            event_type: 'SYNC_SUCCESS',
            message: `Synced ${vehicles.length} active, Marked ${soldCount} sold.`,
            details: {
                processed_count: vehicles.length,
                sold_count: soldCount,
                upserted_count: dbVehicles.length,
                skipped_count: meta.skipped_count || 0,
                skipped_details: meta.skipped_details || [],
            }
        });

        return NextResponse.json({
            success: true,
            message: `Processed ${vehicles.length} vehicles. Sold: ${soldCount}`,
            stats: {
                processed: vehicles.length,
                sold: soldCount,
                skipped: meta.skipped_count || 0
            }
        });

    } catch (error: any) {
        console.error('Inventory Sync Error:', error);

        // 5. Log Error
        try {
            await supabase.from('sync_logs').insert({
                event_type: 'SYNC_ERROR',
                message: 'Failed to process inventory file.',
                details: { error: error.message }
            });
        } catch (logError) {
            console.error('Failed to log error to DB:', logError);
        }

        // 6. Send Critical Alert Email
        await sendEmail({
            to: 'sales@zorsanmotors.com', // Updated to correct email
            subject: '🚨 CRITICAL: Inventory Sync Failed',
            html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #ef4444;">System Alert: Sync Failed</h2>
                <p>The automated inventory sync encountered a critical error.</p>
                
                <div style="background: #fef2f2; padding: 15px; border-radius: 6px; border-left: 4px solid #ef4444; margin: 20px 0;">
                    <strong>Error Message:</strong><br/>
                    <code>${error.message}</code>
                </div>

                <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                <p>Please check the <a href="https://zorsanmotors.com/zm-console/logs">Admin Dashboard</a> for more details.</p>
            </div>
        `
        });

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
