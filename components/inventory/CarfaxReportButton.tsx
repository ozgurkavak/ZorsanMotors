import { FileText, ExternalLink } from "lucide-react";

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
            className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-white to-gray-200 p-[1px] border border-gray-300 shadow-md outline-none transition-all duration-300 hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] hover:border-blue-300 cursor-pointer"
            title="View Free CARFAX Report"
        >
            {/* Static glossy top highlight */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/90 to-transparent z-10 pointer-events-none rounded-t-xl" />

            {/* Sweeping dynamic light shine on hover */}
            <div className="absolute -left-[100%] top-0 bottom-0 w-[50%] bg-gradient-to-r from-transparent via-white to-transparent skew-x-[-30deg] transition-all duration-700 ease-in-out group-hover:left-[200%] z-20 pointer-events-none" />

            {/* Inner Content Block */}
            <div className="relative flex w-full flex-col items-center justify-center rounded-[10px] bg-gradient-to-b from-[#fdfdfd] to-[#eaeaea] px-4 py-3 sm:py-3.5 z-10">
                <div 
                    className="text-2xl sm:text-[28px] leading-none tracking-tighter uppercase mb-1 drop-shadow-sm transition-transform duration-300 group-hover:scale-105" 
                    style={{ fontFamily: "'Arial Black', Impact, sans-serif" }}
                >
                    <span className="text-black">CAR</span><span className="text-[#005fb8]">FAX</span>
                </div>
                <div className="text-[8px] sm:text-[10px] leading-none tracking-[0.25em] uppercase text-gray-600 font-bold font-sans">
                    Vehicle History Reports
                </div>
            </div>
        </a>
    );
}
