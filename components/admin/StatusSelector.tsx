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

    const getVariant = (status: string) => {
        switch (status) {
            case 'Available': return 'default';
            case 'Sold': return 'destructive';
            case 'Pending': return 'secondary';
            case 'Reserved': return 'outline';
            default: return 'secondary';
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="cursor-pointer inline-flex items-center">
                    <Badge
                        variant={getVariant(vehicle.status || 'Available')}
                        className="hover:opacity-80 transition-opacity gap-1"
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
