"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface FilterSidebarProps {
    makes: string[];
    bodyTypes: string[];
}

export function FilterSidebar({ makes, bodyTypes }: FilterSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [make, setMake] = useState(searchParams.get("make") || "all");
    const [bodyType, setBodyType] = useState(searchParams.get("bodyType") || "all");
    const [maxPrice, setMaxPrice] = useState([
        Number(searchParams.get("maxPrice")) || 100000
    ]);
    const [maxMileage, setMaxMileage] = useState([
        Number(searchParams.get("maxMileage")) || 200000
    ]);

    const handleApply = () => {
        const params = new URLSearchParams();
        if (make && make !== "all") params.set("make", make);
        if (bodyType && bodyType !== "all") params.set("bodyType", bodyType);
        if (maxPrice[0] < 100000) params.set("maxPrice", maxPrice[0].toString());
        if (maxMileage[0] < 200000) params.set("maxMileage", maxMileage[0].toString());

        router.push(`/inventory?${params.toString()}`);
    };

    const handleReset = () => {
        setMake("all");
        setBodyType("all");
        setMaxPrice([100000]);
        setMaxMileage([200000]);
        router.push("/inventory");
    };

    return (
        <div className="space-y-6 rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold leading-none tracking-tight">Filters</h3>
                <Button variant="ghost" size="sm" onClick={handleReset}>
                    Reset
                </Button>
            </div>
            <Separator />

            <div className="space-y-2">
                <Label>Make</Label>
                <Select value={make} onValueChange={setMake}>
                    <SelectTrigger>
                        <SelectValue placeholder="All Makes" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Makes</SelectItem>
                        {makes.map((m) => (
                            <SelectItem key={m} value={m}>
                                {m}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Body Type</Label>
                <Select value={bodyType} onValueChange={setBodyType}>
                    <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {bodyTypes.map((b) => (
                            <SelectItem key={b} value={b}>
                                {b}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label>Max Price</Label>
                    <span className="text-sm text-muted-foreground">
                        ${maxPrice[0].toLocaleString()}
                    </span>
                </div>
                <Slider
                    value={maxPrice}
                    onValueChange={setMaxPrice}
                    max={100000}
                    step={1000}
                />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label>Max Mileage</Label>
                    <span className="text-sm text-muted-foreground">
                        {maxMileage[0].toLocaleString()} mi
                    </span>
                </div>
                <Slider
                    value={maxMileage}
                    onValueChange={setMaxMileage}
                    max={200000}
                    step={5000}
                />
            </div>

            <Button className="w-full" onClick={handleApply}>
                Apply Filters
            </Button>
        </div>
    );
}
