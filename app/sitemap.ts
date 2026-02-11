import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zorsanmotors.com';

    // Fetch all vehicle IDs
    const { data: vehicles } = await supabase
        .from('vehicles')
        .select('id, createdAt');

    const vehicleEntries = (vehicles || []).map((vehicle) => ({
        url: `${baseUrl}/inventory/${vehicle.id}`,
        lastModified: vehicle.createdAt ? new Date(vehicle.createdAt) : new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/inventory`,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/finance`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        ...vehicleEntries,
    ];
}
