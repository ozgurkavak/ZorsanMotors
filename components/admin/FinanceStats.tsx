"use client";

import { useVehicles } from "@/lib/vehicle-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Tag, TrendingUp, ShoppingCart, Activity } from "lucide-react";

export function FinanceStats() {
    const { vehicles } = useVehicles();

    // 1. Status Breakdown (Fixed List)
    const definedStatuses = ["Available", "Sold", "Reserved", "Pending"];

    // Calculate counts
    const statusCounts = vehicles.reduce((acc, vehicle) => {
        const status = vehicle.status || "Unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // 2. Financial Aggregates (Active Inventory Only)
    let activePurchase = 0;
    let activeExpenses = 0;
    let activeCount = 0;

    vehicles.forEach(v => {
        // Calculate Cost for Active (Available, Reserved, Pending) vehicles only
        if (v.status !== 'Sold') {
            const purchase = v.purchasePrice || 0;
            const expenses = v.expenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;

            activePurchase += purchase;
            activeExpenses += expenses;
            activeCount++;
        }
    });

    const totalActiveCost = activePurchase + activeExpenses;
    const avgActiveCost = activeCount > 0 ? totalActiveCost / activeCount : 0;

    // Realized Profit (Sold vehicles only)
    let realizedProfit = 0;
    let realizedCost = 0;
    let realizedSale = 0;
    let soldCount = 0;

    vehicles.forEach(v => {
        if (v.status === 'Sold') {
            const purchase = v.purchasePrice || 0;
            const expenses = v.expenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;
            const cost = purchase + expenses;

            // Use Sale Price if set, otherwise fallback to Listing Price
            const sale = v.salePrice && v.salePrice > 0 ? v.salePrice : (v.price || 0);

            if (sale > 0) {
                realizedProfit += (sale - cost);
                realizedSale += sale;
                realizedCost += cost;
                soldCount++;
            }
        }
    });

    const avgSale = soldCount > 0 ? realizedSale / soldCount : 0;
    const avgProfit = soldCount > 0 ? realizedProfit / soldCount : 0;

    // Status Colors Mapping
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'available': return 'bg-green-100/50 text-green-700 border-green-200';
            case 'sold': return 'bg-red-100/50 text-red-700 border-red-200';
            case 'reserved': return 'bg-yellow-100/50 text-yellow-700 border-yellow-200';
            case 'pending': return 'bg-orange-100/50 text-orange-700 border-orange-200';
            default: return 'bg-gray-100/50 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8 items-stretch">
            {/* Status Breakdown Card */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-1 flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Inventory Status</CardTitle>
                    <Tag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="flex-1">
                    <div className="space-y-2">
                        {definedStatuses.map((status) => (
                            <div key={status} className={`flex items-center justify-between px-3 py-2 rounded-md border text-xs font-semibold ${getStatusColor(status)}`}>
                                <span>{status}</span>
                                <span className="bg-white/80 px-2 py-0.5 rounded-full min-w-[1.5rem] text-center shadow-sm">
                                    {statusCounts[status] || 0}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Total Inventory Cost (Active Only) */}
            <Card className="flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Active Inventory Cost</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="flex flex-col flex-1 justify-between gap-4">
                    <div>
                        <div className="text-2xl font-bold">${totalActiveCost.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Breakdown: <br />
                            Purchase: ${activePurchase.toLocaleString()} <br />
                            Expenses: ${activeExpenses.toLocaleString()}
                        </p>
                    </div>
                    <div className="pt-4 border-t mt-auto">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">Avg Cost / Car</span>
                            <span className="font-medium">${avgActiveCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Total Sales (Realized) */}
            <Card className="flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="flex flex-col flex-1 justify-between gap-4">
                    <div>
                        <div className="text-2xl font-bold text-blue-600">${realizedSale.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Realized from {soldCount} sold vehicles.
                        </p>
                    </div>
                    <div className="pt-4 border-t mt-auto">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">Avg Sale Price</span>
                            <span className="font-medium">${avgSale.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Net Profit (Realized) */}
            <Card className="flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium">Net Profit (Realized)</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="flex flex-col flex-1 justify-between gap-4">
                    <div>
                        <div className={`text-2xl font-bold ${realizedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${realizedProfit.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {realizedProfit >= 0 ? '+' : ''}{((realizedProfit / realizedCost || 0) * 100).toFixed(1)}% Margin
                        </p>
                    </div>
                    <div className="pt-4 border-t mt-auto">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">Avg Profit / Sold</span>
                            <span className={`font-medium ${avgProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ${avgProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
