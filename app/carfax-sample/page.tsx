import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Check, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function CarfaxSamplePage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-3xl font-black text-blue-600">CARFAX</span>
                        <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-sm font-bold">VEHICLE HISTORY REPORT</span>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-500">Analysis Date</p>
                        <p className="font-bold">{new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-1 border-t-4 border-t-green-500 h-full">
                        <CardHeader className="bg-green-50 dark:bg-green-950/20 pb-2">
                            <CardTitle className="flex flex-col items-center text-center gap-2">
                                <CheckCircle2 className="h-12 w-12 text-green-600" />
                                <span className="text-green-700 dark:text-green-400 font-bold text-lg">Clean Title</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 text-center">
                            <p className="text-slate-600 dark:text-slate-400">No accidents or damage reported to CARFAX.</p>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-1 border-t-4 border-t-green-500 h-full">
                        <CardHeader className="bg-green-50 dark:bg-green-950/20 pb-2">
                            <CardTitle className="flex flex-col items-center text-center gap-2">
                                <ShieldCheck className="h-12 w-12 text-green-600" />
                                <span className="text-green-700 dark:text-green-400 font-bold text-lg">1 Owner</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 text-center">
                            <p className="text-slate-600 dark:text-slate-400">Purchased new and owned by 1 individual.</p>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-1 border-t-4 border-t-green-500 h-full">
                        <CardHeader className="bg-green-50 dark:bg-green-950/20 pb-2">
                            <CardTitle className="flex flex-col items-center text-center gap-2">
                                <Check className="h-12 w-12 text-green-600" />
                                <span className="text-green-700 dark:text-green-400 font-bold text-lg">Personal Use</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 text-center">
                            <p className="text-slate-600 dark:text-slate-400">Driven for personal use only (no fleet/taxi).</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Vehicle Specs */}
                <Card>
                    <CardHeader>
                        <CardTitle>Vehicle Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <p className="text-sm text-slate-500">VIN</p>
                            <p className="font-mono font-medium">1FTEW1E50KFA12345</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Make/Model</p>
                            <p className="font-medium">2021 Ford F-150 Lariat</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Engine</p>
                            <p className="font-medium">3.5L V6 EcoBoost</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Body Style</p>
                            <p className="font-medium">SuperCrew Cab</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Detailed History */}
                <Card>
                    <CardHeader>
                        <CardTitle>Detailed History</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="h-full w-0.5 bg-slate-200"></div>
                            </div>
                            <div className="pb-8">
                                <Badge className="bg-green-600 mb-2">2024</Badge>
                                <h4 className="font-bold">Service Visit</h4>
                                <p className="text-sm text-slate-500">Dealer Service Center - Brockton, MA</p>
                                <p className="text-sm mt-1 mb-2">Oil and filter changed, tires rotated, multi-point inspection performed.</p>
                                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                                    <CheckCircle2 className="h-4 w-4" /> Passed Safety Inspection
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="h-full w-0.5 bg-slate-200"></div>
                            </div>
                            <div className="pb-8">
                                <Badge variant="secondary" className="mb-2">2023</Badge>
                                <h4 className="font-bold">Registration Renewal</h4>
                                <p className="text-sm text-slate-500">Massachusetts RMV</p>
                                <p className="text-sm mt-1">Registration updated. Odometer reading: 18,500 miles.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="h-full w-0.5 bg-slate-200"></div>
                            </div>
                            <div>
                                <Badge variant="secondary" className="mb-2">2021</Badge>
                                <h4 className="font-bold">Vehicle Purchase</h4>
                                <p className="text-sm text-slate-500">Original Dealer - Boston, MA</p>
                                <p className="text-sm mt-1">Vehicle sold to first owner.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center text-xs text-slate-400 py-4">
                    This is a mock report generated for demonstration purposes by CarShop.US. Not an official document.
                </div>

            </div>
        </div>
    );
}
