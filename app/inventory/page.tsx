"use client";

import { useSearchParams } from "next/navigation";
import { FilterSidebar } from "@/components/inventory/FilterSidebar";
import { InventoryDisplay } from "@/components/inventory/InventoryDisplay";
import { useVehicles } from "@/lib/vehicle-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { Suspense } from "react";

function InventoryContent() {
    const searchParams = useSearchParams();
    const { vehicles } = useVehicles();

    const make = searchParams.get('make') || 'all';
    const bodyType = searchParams.get('bodyType') || 'all';
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : 1000000;
    const maxMileage = searchParams.get('maxMileage') ? parseInt(searchParams.get('maxMileage')!) : 500000;

    const filteredVehicles = vehicles.filter((vehicle) => {
        const matchesMake = make === 'all' || vehicle.make === make;
        const matchesBody = bodyType === 'all' || vehicle.bodyType === bodyType;
        const matchesPrice = vehicle.price <= maxPrice;
        const matchesMileage = vehicle.mileage <= maxMileage;
        return matchesMake && matchesBody && matchesPrice && matchesMileage;
    });

    const uniqueMakes = Array.from(new Set(vehicles.map((v) => v.make))).sort();
    const uniqueBodyTypes = Array.from(new Set(vehicles.map((v) => v.bodyType).filter(Boolean) as string[])).sort();

    return (
        <div className="container max-w-[1600px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* Mobile Filter Toggle */}
            <div className="flex flex-col gap-4 md:hidden mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
                    <p className="text-muted-foreground">Find the perfect car for your journey.</p>
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="w-full">
                            <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <FilterSidebar makes={uniqueMakes} bodyTypes={uniqueBodyTypes} />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Layout */}
            <div className="flex gap-8">
                {/* Desktop Sidebar */}
                <aside className="hidden md:block w-64 shrink-0">
                    <div className="sticky top-24">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold tracking-tight">Filters</h1>
                            <p className="text-sm text-muted-foreground">Refine your search</p>
                        </div>
                        <FilterSidebar makes={uniqueMakes} bodyTypes={uniqueBodyTypes} />
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-w-0">
                    <InventoryDisplay vehicles={filteredVehicles} />
                </main>
            </div>
        </div>
    );
}

export default function InventoryPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <InventoryContent />
        </Suspense>
    );
}
