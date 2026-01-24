import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Vehicle } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Fuel, Gauge, Calendar, Zap, CreditCard, CarFront } from "lucide-react";

interface CarCardProps {
    vehicle: Vehicle;
}

export function CarCard({ vehicle }: CarCardProps) {
    const [imgError, setImgError] = useState(false);
    const montlyPayment = Math.round(vehicle.price / 72);

    return (
        <Link href={`/inventory/${vehicle.id}`} className="block h-full cursor-pointer select-none">
            <Card className="h-full group overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                        src={(!imgError && vehicle.image) ? vehicle.image : "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=800"}
                        alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                        fill
                        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
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
                            <h3 className="line-clamp-1 text-lg font-bold group-hover:text-primary transition-colors">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                            </h3>
                        </div>
                        <p className="text-xl font-bold text-primary">
                            ${vehicle.price.toLocaleString()}
                        </p>
                    </div>
                </CardHeader>

                <CardContent className="p-4 pt-2 pb-6">
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
                </CardContent>
            </Card>
        </Link>
    );
}
