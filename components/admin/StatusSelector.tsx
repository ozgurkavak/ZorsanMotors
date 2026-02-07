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
            case 'Available':
                return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200/50 hover:bg-emerald-200 dark:hover:bg-emerald-500/30';
            case 'Sold':
                return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200/50 hover:bg-red-200 dark:hover:bg-red-500/30';
            case 'Pending':
                return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200/50 hover:bg-amber-200 dark:hover:bg-amber-500/30';
            case 'Reserved':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200/50 hover:bg-blue-200 dark:hover:bg-blue-500/30';
            default:
                return 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
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
