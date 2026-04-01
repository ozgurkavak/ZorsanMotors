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
            <div className="relative overflow-hidden flex items-center p-4 sm:p-5 w-full bg-card/50 backdrop-blur-md border border-border rounded-xl hover:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.25)]">
                {/* Subtle blue pulse layer */}
                <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-500" />

                <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 text-blue-500 transition-colors duration-300 shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                
                <div className="ml-4 flex-1 text-left relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                   <p className="text-foreground font-semibold text-base sm:text-lg flex items-center gap-2">
                        Get CARFAX® Report
                        <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                   </p>
                   <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
                        Free vehicle history and detailed condition report.
                   </p>
                </div>
            </div>
        </a>
    );
}
