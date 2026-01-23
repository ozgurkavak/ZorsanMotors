"use client";

import { useVehicles } from "@/lib/vehicle-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Gauge, Fuel, Zap, CheckCircle2, ArrowLeft, CarFront } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { use, useState } from "react";

interface CarPageProps {
    params: Promise<{ id: string }>;
}

export default function CarPage({ params }: CarPageProps) {
    const { id } = use(params);
    const { vehicles } = useVehicles();
    const vehicle = vehicles.find((v) => v.id === id);

    const [activeImageIndex, setActiveImageIndex] = useState(0);

    if (!vehicle) {
        return <div className="p-8 text-center text-red-500">Vehicle not found (might be loading or persisted data issue).</div>;
    }

    const montlyPayment = Math.round(vehicle.price / 72);

    const images = (vehicle.images && vehicle.images.length > 0) ? vehicle.images : [vehicle.image];
    const activeImage = images[activeImageIndex] || vehicle.image;

    // Dynamic carfax link generator
    const getCarfaxLink = (v: typeof vehicle) => {
        if (v.carfaxUrl && (v.carfaxUrl.startsWith("http") || v.carfaxUrl.includes("carfax-sample"))) return v.carfaxUrl;
        return `/carfax-report/${v.id}`;
    };

    return (
        <div className="container py-8">
            <Button variant="ghost" asChild className="mb-4">
                <Link href="/inventory"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Inventory</Link>
            </Button>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Image Section */}
                <div className="space-y-4">
                    <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted">
                        <Image
                            src={activeImage}
                            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {images.map((img, i) => (
                            <div
                                key={i}
                                className={`relative aspect-video overflow-hidden rounded-lg border bg-muted cursor-pointer transition-all ${activeImageIndex === i ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'}`}
                                onClick={() => setActiveImageIndex(i)}
                            >
                                <Image
                                    src={img}
                                    alt="Thumbnail"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info Section */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{vehicle.condition}</Badge>
                            <Badge variant="secondary">{vehicle.status || "Available"}</Badge>
                        </div>
                        <h1 className="text-3xl font-bold">{vehicle.year} {vehicle.make} {vehicle.model}</h1>
                        <p className="text-xl text-primary font-bold mt-2">${vehicle.price.toLocaleString()}</p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <Calendar className="h-5 w-5 text-primary" />
                            <div>
                                <p className="text-xs text-muted-foreground">Year</p>
                                <p className="font-medium">{vehicle.year}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <Gauge className="h-5 w-5 text-primary" />
                            <div>
                                <p className="text-xs text-muted-foreground">Mileage</p>
                                <p className="font-medium">{vehicle.mileage.toLocaleString()} mi</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <CarFront className="h-5 w-5 text-primary" />
                            <div>
                                <p className="text-xs text-muted-foreground">Body Style</p>
                                <p className="font-medium">{vehicle.bodyType || "N/A"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <Zap className="h-5 w-5 text-primary" />
                            <div>
                                <p className="text-xs text-muted-foreground">Transmission</p>
                                <p className="font-medium">{vehicle.transmission}</p>
                            </div>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Estimated Payment</span>
                                <span className="text-xl font-bold">${montlyPayment}/mo</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                *Estimated payment based on 72-month term at 5% APR with $0 down.
                                Actual terms may vary.
                            </p>
                            <div className="grid gap-2">
                                <Button size="lg" className="w-full" asChild>
                                    <Link href="/finance">Apply for Financing</Link>
                                </Button>
                                {vehicle.carfaxUrl || true ? ( // Always show for demo
                                    <Button size="lg" variant="outline" className="w-full font-semibold border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-950" asChild>
                                        <Link href={getCarfaxLink(vehicle)} target={getCarfaxLink(vehicle).startsWith("http") ? "_blank" : undefined}>
                                            <span className="font-extrabold mr-1">CARFAX</span> Report
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button size="lg" variant="outline" disabled className="w-full font-semibold opacity-50 cursor-not-allowed">
                                        <span className="font-extrabold mr-1">CARFAX</span> Unavailable
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-2">
                        <h3 className="font-semibold">Vehicle Features</h3>
                        <ul className="grid grid-cols-2 gap-2">
                            {["Bluetooth", "Backup Camera", "Heated Seats", "Navigation", "Apple CarPlay", "Lane Assist"].map((feature) => (
                                <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" /> {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
