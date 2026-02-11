
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CarDetailClient } from "@/components/inventory/CarDetailClient";
import { supabase } from "@/lib/supabase";
import { Vehicle } from "@/types";

// Force dynamic rendering since inventory changes
export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ id: string }>;
}

async function getVehicle(id: string): Promise<Vehicle | null> {
    const { data: vehicle, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !vehicle) {
        return null;
    }

    return vehicle as Vehicle;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const vehicle = await getVehicle(id);

    if (!vehicle) {
        return {
            title: "Vehicle Not Found | ZorSan Motors",
            description: "The requested vehicle could not be found in our inventory."
        };
    }

    const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} - $${vehicle.price.toLocaleString()} | ZorSan Motors`;
    const description = `Check out this ${vehicle.year} ${vehicle.make} ${vehicle.model} with ${vehicle.mileage.toLocaleString()} miles. ${vehicle.exteriorColor || ''} exterior, ${vehicle.transmission} transmission. Available now at ZorSan Motors.`;
    const imageUrl = vehicle.image || '/placeholder.png'; // Fallback image

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: [{ url: imageUrl }],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: [imageUrl],
        }
    };
}

export default async function CarPage({ params }: PageProps) {
    const { id } = await params;
    const vehicle = await getVehicle(id);

    if (!vehicle) {
        notFound();
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Vehicle',
        name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
        image: [vehicle.image || '/placeholder.png'],
        description: `Check out this ${vehicle.year} ${vehicle.make} ${vehicle.model} with ${vehicle.mileage.toLocaleString()} miles. Available now at ZorSan Motors.`,
        vehicleIdentificationNumber: vehicle.vin,
        brand: {
            '@type': 'Brand',
            name: vehicle.make
        },
        model: vehicle.model,
        vehicleModelDate: vehicle.year,
        mileageFromOdometer: {
            '@type': 'QuantitativeValue',
            value: vehicle.mileage,
            unitCode: 'SMI'
        },
        offers: {
            '@type': 'Offer',
            price: vehicle.price,
            priceCurrency: 'USD',
            availability: (vehicle.status || 'Available') === 'Sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/UsedCondition'
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CarDetailClient vehicle={vehicle} />
        </>
    );
}
