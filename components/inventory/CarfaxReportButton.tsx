"use client";

import { ShieldCheck, ArrowUpRight } from "lucide-react";

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
            className="block w-full group"
            title="View Free CARFAX® Vehicle History Report"
        >
            <div className="relative overflow-hidden flex items-center p-4 sm:p-5 w-full bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity duration-300 shadow-md hover:shadow-lg">
                <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-background/20 text-primary-foreground shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                
                <div className="ml-4 flex-1 text-left relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                   <p className="font-semibold text-base sm:text-lg flex items-center gap-2">
                        Get CARFAX® Report
                        <ArrowUpRight className="w-4 h-4 opacity-70" />
                   </p>
                   <p className="opacity-80 text-xs sm:text-sm mt-0.5">
                        Free vehicle history and detailed condition report.
                   </p>
                </div>
            </div>
        </a>
    );
}
