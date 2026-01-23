import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Vehicle } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Fuel, Gauge, Calendar, Zap, CreditCard, CarFront } from "lucide-react";

interface CarCardProps {
    vehicle: Vehicle;
}

export function CarCard({ vehicle }: CarCardProps) {
    const [imgError, setImgError] = useState(false);
    const montlyPayment = Math.round(vehicle.price / 72);

    return (
        <Card className="group overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
            <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                    src={(!imgError && vehicle.image) ? vehicle.image : "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=800"}
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={() => setImgError(true)}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-2 right-2">
                    <Badge variant={vehicle.condition === 'Certified Pre-Owned' ? 'default' : 'secondary'} className="backdrop-blur-md">
                        {vehicle.condition === 'Certified Pre-Owned' ? 'CPO' : vehicle.condition}
                    </Badge>
                </div>
            </div>

            <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="line-clamp-1 text-lg font-bold">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                        </h3>
                    </div>
                    <p className="text-xl font-bold text-primary">
                        ${vehicle.price.toLocaleString()}
                    </p>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-2">
                <Separator className="mb-4" />
                <div className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <CarFront className="h-4 w-4 text-primary" />
                        <span>{vehicle.bodyType || "Car"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-primary" />
                        <span>{vehicle.mileage.toLocaleString()} mi</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Fuel className="h-4 w-4 text-primary" />
                        <span>{vehicle.fuelType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span>{vehicle.transmission}</span>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/50 p-2">
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium">Est. Payment</span>
                    </div>
                    <span className="text-sm font-bold">${montlyPayment}/mo</span>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 grid gap-2">
                {vehicle.carfaxUrl ? (
                    <Button variant="outline" className="w-full font-semibold border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-950" asChild>
                        <a href={vehicle.carfaxUrl} target="_blank" rel="noopener noreferrer">
                            <span className="font-extrabold mr-1">CARFAX</span> Report
                        </a>
                    </Button>
                ) : (
                    <Button variant="outline" disabled className="w-full font-semibold opacity-50 cursor-not-allowed">
                        <span className="font-extrabold mr-1">CARFAX</span> Unavailable
                    </Button>
                )}
                <Button asChild className="w-full font-semibold">
                    <Link href={`/inventory/${vehicle.id}`}>
                        View Details
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
