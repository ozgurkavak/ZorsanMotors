"use client";

import { useVehicles } from "@/lib/vehicle-context";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Check, ShieldCheck, FileText } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { use } from "react";

interface CarfaxReportPageProps {
    params: Promise<{ id: string }>;
}

export default function CarfaxReportPage({ params }: CarfaxReportPageProps) {
    const { id } = use(params);
    const { vehicles } = useVehicles();
    const vehicle = vehicles.find((v) => v.id === id);

    if (!vehicle) {
        return <div className="p-12 text-center">Loading Report...</div>;
    }

    if (!vehicle) {
        notFound();
    }

    // Generate consistent "mock" dates based on vehicle year
    const purchaseYear = vehicle.year;
    const currentYear = new Date().getFullYear();
    const serviceVisits = Math.max(1, (currentYear - purchaseYear) * 2);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-3xl font-black text-blue-600 tracking-tighter">CARFAX</span>
                        <div className="flex flex-col">
                            <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-bold tracking-wide">VEHICLE HISTORY REPORT</span>
                            <span className="text-[10px] text-slate-500 mt-0.5">GENERATED FOR ZORSAN MOTORS</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Report Date</p>
                        <p className="font-bold text-slate-900 dark:text-slate-100">{new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-1 border-t-4 border-t-green-500 h-full shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="bg-green-50 dark:bg-green-950/20 pb-4 border-b border-green-100 dark:border-green-900/10">
                            <CardTitle className="flex flex-col items-center text-center gap-3">
                                <div className="p-3 bg-white dark:bg-slate-900 rounded-full shadow-sm">
                                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                                </div>
                                <span className="text-green-800 dark:text-green-400 font-extrabold text-xl">Clean Title</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 text-center">
                            <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                No accidents or damage reported to CARFAX.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-1 border-t-4 border-t-green-500 h-full shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="bg-green-50 dark:bg-green-950/20 pb-4 border-b border-green-100 dark:border-green-900/10">
                            <CardTitle className="flex flex-col items-center text-center gap-3">
                                <div className="p-3 bg-white dark:bg-slate-900 rounded-full shadow-sm">
                                    <ShieldCheck className="h-8 w-8 text-green-600" />
                                </div>
                                <span className="text-green-800 dark:text-green-400 font-extrabold text-xl">
                                    {vehicle.condition === 'Certified Pre-Owned' ? '1 Owner' : '2 Owners'}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 text-center">
                            <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                {vehicle.condition === 'Certified Pre-Owned'
                                    ? 'Purchased new and owned by only 1 individual.'
                                    : 'Well maintained by previous owners.'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-1 border-t-4 border-t-green-500 h-full shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="bg-green-50 dark:bg-green-950/20 pb-4 border-b border-green-100 dark:border-green-900/10">
                            <CardTitle className="flex flex-col items-center text-center gap-3">
                                <div className="p-3 bg-white dark:bg-slate-900 rounded-full shadow-sm">
                                    <Check className="h-8 w-8 text-green-600" />
                                </div>
                                <span className="text-green-800 dark:text-green-400 font-extrabold text-xl">Personal Use</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 text-center">
                            <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                Driven for personal use only (no fleet/taxi reported).
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Vehicle Specs Header */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border p-6">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="relative h-32 w-48 rounded-lg overflow-hidden shrink-0 border">
                            <Image
                                src={vehicle.image}
                                alt={vehicle.model}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">VIN</p>
                                <p className="font-mono font-medium text-slate-900 dark:text-slate-200">{vehicle.vin}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Vehicle</p>
                                <p className="font-medium text-slate-900 dark:text-slate-200">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Body Style</p>
                                <p className="font-medium text-slate-900 dark:text-slate-200">{vehicle.bodyType}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Engine</p>
                                <p className="font-medium text-slate-900 dark:text-slate-200">{vehicle.fuelType} Powertrain</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed History */}
                <Card className="overflow-hidden">
                    <CardHeader className="bg-slate-50 dark:bg-slate-900/50 border-b">
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-600" /> Detailed History
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {/* Latest Event */}
                            <div className="p-6 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5 shadow-sm ring-4 ring-green-100 dark:ring-green-900/30"></div>
                                        <div className="w-0.5 bg-slate-200 dark:bg-slate-800 h-full mt-1"></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <Badge className="bg-green-600 hover:bg-green-700">{currentYear}</Badge>
                                            <span className="text-sm text-slate-500 font-medium">Latest Record</span>
                                        </div>
                                        <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">Vehicle Offered for Sale</h4>
                                        <p className="text-sm text-slate-500 font-medium">Zorsan Motors - Brockton, MA</p>
                                        <p className="text-slate-600 dark:text-slate-400 mt-2">
                                            Vehicle inspected, detailed, and listed for sale.
                                        </p>
                                        <div className="flex items-center gap-2 text-green-600 text-sm font-bold mt-3 bg-green-50 dark:bg-green-900/20 inline-flex px-3 py-1 rounded-full">
                                            <CheckCircle2 className="h-4 w-4" /> Passed 150-Point Inspection
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Service History */}
                            <div className="p-6 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 bg-slate-400 rounded-full mt-1.5 ring-4 ring-slate-100 dark:ring-slate-800"></div>
                                        <div className="w-0.5 bg-slate-200 dark:bg-slate-800 h-full mt-1"></div>
                                    </div>
                                    <div className="pb-2">
                                        <div className="flex items-center gap-3 mb-1">
                                            <Badge variant="outline" className="text-slate-600 border-slate-300">{currentYear - 1}</Badge>
                                        </div>
                                        <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">Routine Maintenance</h4>
                                        <p className="text-sm text-slate-500 font-medium">Authorized Dealer</p>
                                        <p className="text-slate-600 dark:text-slate-400 mt-2">
                                            Maintenance inspection completed. Oil and filter changed. Tires rotated.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Purchase History */}
                            <div className="p-6 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 bg-slate-400 rounded-full mt-1.5 ring-4 ring-slate-100 dark:ring-slate-800"></div>
                                    </div>
                                    <div className="pb-2">
                                        <div className="flex items-center gap-3 mb-1">
                                            <Badge variant="outline" className="text-slate-600 border-slate-300">{purchaseYear}</Badge>
                                        </div>
                                        <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">Vehicle Manufactured and Sold</h4>
                                        <p className="text-sm text-slate-500 font-medium">Original Dealer</p>
                                        <p className="text-slate-600 dark:text-slate-400 mt-2">
                                            Vehicle manufactured and sold to original owner. Title issued.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-center py-6">
                    <p className="text-center text-xs text-slate-400 max-w-lg leading-relaxed">
                        This report is a simulation generated for demonstration purposes by ZorsanMotors.
                        It is intended to showcase the functionality of the platform and does not represent real-world
                        data for the vehicle with VIN {vehicle.vin}.
                    </p>
                </div>
            </div>
        </div>
    );
}
