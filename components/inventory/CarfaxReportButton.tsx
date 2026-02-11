"use client";

import Image from "next/image";

interface CarfaxReportButtonProps {
    vin: string;
}

export function CarfaxReportButton({ vin }: CarfaxReportButtonProps) {
    if (!vin) return null;

    const carfaxUrl = `http://www.carfax.com/VehicleHistory/p/Report.cfx?partner=DVW_1&vin=${vin}`;

    return (
        <a
            href={carfaxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block transition-opacity hover:opacity-90"
            title="View Free CARFAX Vehicle History Report"
        >
            <div className="relative w-[150px] h-[50px] sm:w-[180px] sm:h-[60px]">
                <Image
                    src="http://www.carfaxonline.com/assets/subscriber/carfax_free_button.gif"
                    alt="Show Me The CARFAX"
                    fill
                    className="object-contain"
                    unoptimized // Since it's an external GIF from HTTP
                />
            </div>
        </a>
    );
}
