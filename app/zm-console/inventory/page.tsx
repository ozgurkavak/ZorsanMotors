"use client";


import { InventoryTable } from "@/components/admin/InventoryTable";

export default function AdminInventoryPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
                    <p className="text-muted-foreground">Manage your vehicle listings and stock.</p>
                </div>
            </div>

            <div className="grid gap-8">
                <div className="w-full">
                    <InventoryTable />
                </div>
            </div>
        </div>
    );
}
