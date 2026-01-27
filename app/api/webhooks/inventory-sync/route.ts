import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use Service Role Key for Admin write access

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

        // if (error) throw error;

        return NextResponse.json({ success: true, message: `Processed ${vehicles.length} vehicles.` });

    } catch (error: any) {
        console.error('Inventory Sync Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
