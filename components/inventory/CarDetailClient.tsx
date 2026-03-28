"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Gauge, Zap, CheckCircle2, ArrowLeft, CarFront, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CarfaxReportButton } from "@/components/inventory/CarfaxReportButton";
import { Vehicle } from "@/types";

interface CarDetailClientProps {
    vehicle: Vehicle;
}

export function CarDetailClient({ vehicle }: CarDetailClientProps) {
    const router = useRouter();
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const images = (vehicle.images && vehicle.images.length > 0) ? vehicle.images : [vehicle.image];
    const activeImage = images[activeImageIndex] || vehicle.image;

    return (
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Inventory
            </Button>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Image Section */}
                <div className="space-y-4">
                    <div className="relative aspect-[16/10] sm:aspect-video overflow-hidden rounded-xl border bg-black group shadow-sm">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeImageIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={activeImage}
                                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                    fill
                                    className="object-contain sm:object-cover"
                                    priority
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* Carousel Controls */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                                    }}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex flex-col items-center justify-center rounded-full bg-background/80 text-foreground shadow hover:bg-background transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft className="w-5 h-5 mr-0.5" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-background/80 text-foreground shadow hover:bg-background transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
                                    aria-label="Next image"
                                >
                                    <ChevronRight className="w-5 h-5 ml-0.5" />
                                </button>
                            </>
                        )}
                    </div>
                    
                    {/* Thumbnail Strip */}
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-5 gap-2">
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

                    <div className="flex flex-col gap-4 mt-6">
                        <div className="flex justify-center sm:justify-start">
                            <CarfaxReportButton vin={vehicle.vin} />
                        </div>
                        <Button size="lg" className="w-full" asChild>
                            <Link href="/finance">Apply for Financing</Link>
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-semibold">Vehicle Features</h3>
                        {vehicle.features && vehicle.features.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {vehicle.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" /> {feature}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">No features listed.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
