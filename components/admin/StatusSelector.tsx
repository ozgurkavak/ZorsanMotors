"use client";

import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Vehicle } from "@/types";
import { useVehicles } from "@/lib/vehicle-context";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface StatusSelectorProps {
    vehicle: Vehicle;
}

export function StatusSelector({ vehicle }: StatusSelectorProps) {
    const { updateVehicle } = useVehicles();
    const [loading, setLoading] = useState(false);

    const statuses = ["Available", "Pending", "Sold", "Reserved"];

    const handleStatusChange = async (newStatus: string) => {
        if (newStatus === vehicle.status) return;
        setLoading(true);
        try {
            await updateVehicle(vehicle.id, { status: newStatus });
        } catch (error) {
            console.error("Failed to update status", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Available': return 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent';
            case 'Sold': return 'bg-red-600 hover:bg-red-700 text-white border-transparent';
            case 'Pending': return 'bg-amber-500 hover:bg-amber-600 text-white border-transparent';
            case 'Reserved': return 'bg-blue-600 hover:bg-blue-700 text-white border-transparent';
            default: return 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="cursor-pointer inline-flex items-center">
                    <Badge
                        variant="outline"
                        className={`transition-colors gap-1 ${getStatusStyles(vehicle.status || 'Available')}`}
                    >
                        {vehicle.status || 'Available'}
                        {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                    </Badge>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                {statuses.map((status) => (
                    <DropdownMenuItem
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className={vehicle.status === status ? "bg-accent font-medium" : "cursor-pointer"}
                    >
                        {status}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
