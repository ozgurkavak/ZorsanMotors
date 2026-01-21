"use client";

import { useVehicles } from "@/lib/vehicle-context";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";

export function InventoryTable() {
    const { vehicles } = useVehicles();
    // Show only first 8 for dashboard
    const recentVehicles = vehicles.slice(0, 8);

    return (
        <div className="rounded-xl border bg-card shadow-sm">
            <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Recent Inventory</h3>
                <p className="text-sm text-muted-foreground">Manage your vehicle listings.</p>
            </div>
            <div className="relative w-full overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Vehicle</TableHead>
                            <TableHead>VIN</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentVehicles.map((vehicle) => (
                            <TableRow key={vehicle.id}>
                                <TableCell className="font-medium">
                                    {vehicle.year} {vehicle.make} {vehicle.model}
                                </TableCell>
                                <TableCell className="font-mono text-xs">{vehicle.vin}</TableCell>
                                <TableCell>${vehicle.price.toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge variant={vehicle.condition === 'Certified Pre-Owned' ? 'default' : 'secondary'}>
                                        {vehicle.condition === 'Certified Pre-Owned' ? 'Available' : 'Sold'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
