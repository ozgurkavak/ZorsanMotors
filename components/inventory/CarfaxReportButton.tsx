import Image from "next/image";
import { Button } from "@/components/ui/button";

interface CarfaxReportButtonProps {
    vin: string;
}

export function CarfaxReportButton({ vin }: CarfaxReportButtonProps) {
    if (!vin) return null;

    const carfaxUrl = `http://www.carfax.com/VehicleHistory/p/Report.cfx?partner=DVW_1&vin=${vin}`;

    return (
        <Button size="lg" className="w-full text-base font-semibold group h-[56px] shadow-lg" asChild>
            <a 
                href={carfaxUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center gap-2 sm:gap-3"
                title="View Free CARFAX Report"
            >
                <span className="hidden sm:inline">Show Me The</span>
                <span className="sm:hidden">View</span>
                
                {/* Clean, transparent CARFAX typography logo */}
                <div className="relative w-[85px] h-[22px] sm:w-[100px] sm:h-[26px]">
                    <Image
                        src="https://www.carfax.com/wsc/img/carfax-logo.svg"
                        alt="CARFAX"
                        fill
                        className="object-contain filter contrast-125"
                        unoptimized
                    />
                </div>
                
                <span>Report</span>
            </a>
        </Button>
    );
}
