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
        // -----------------------

        const { vehicles } = body;

        if (!Array.isArray(vehicles)) {
            return NextResponse.json({ error: 'Invalid data format. "vehicles" array required.' }, { status: 400 });
        }

        console.log(`Received ${vehicles.length} vehicles for sync.`);

        // 3. Sync Logic (Upsert based on VIN or Stock Number)
        // For now, let's assume we are upserting. 
        // real implementation depends on the CSV schema we decide on.

        // Example:
        // const { error } = await supabase
        //   .from('vehicles')
        //   .upsert(vehicles, { onConflict: 'vin' });

        // 4. Log Success
        await supabase.from('sync_logs').insert({
            event_type: 'SYNC_SUCCESS',
            message: `Successfully processed ${vehicles.length} vehicle(s).`,
            details: { count: vehicles.length, example_vin: vehicles[0]?.vin }
        });

        return NextResponse.json({ success: true, message: `Processed ${vehicles.length} vehicles.` });

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
            to: 'admin@zorsanmotors.com', // Or use env var
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
