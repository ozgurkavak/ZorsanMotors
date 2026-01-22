"use client";

import { AddVehicleForm } from "@/components/admin/AddVehicleForm";
import { InventoryTable } from "@/components/admin/InventoryTable";
import { DollarSign, Car, CreditCard, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useVehicles } from "@/lib/vehicle-context";

export default function AdminDashboard() {
    const { vehicles } = useVehicles();

    // Calculate Dynamic Stats
    const activeVehicles = vehicles.filter(v => !v.status || v.status === 'Available');
    const soldVehicles = vehicles.filter(v => v.status === 'Sold');
    const reservedVehicles = vehicles.filter(v => v.status === 'Reserved');

    const totalRevenue = soldVehicles.reduce((sum, v) => sum + v.price, 0);
    const inventoryValue = activeVehicles.reduce((sum, v) => sum + v.price, 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <div className="text-sm text-muted-foreground">Admin / Overview</div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">From {soldVehicles.length} sold vehicles</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                        <Car className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeVehicles.length}</div>
                        <p className="text-xs text-muted-foreground">Vehicles available for sale</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inventory Asset Value</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${inventoryValue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total value of active stock</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Reserved Vehicles</CardTitle>
                        <Tag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{reservedVehicles.length}</div>
                        <p className="text-xs text-muted-foreground">Currently pending sale</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
                {/* Add Form Area */}
                <div className="xl:col-span-1">
                    <AddVehicleForm />
                </div>

                {/* Inventory List Area */}
                <div className="xl:col-span-2">
                    <InventoryTable limit={5} />
                </div>
            </div>
        </div>
    );
}
