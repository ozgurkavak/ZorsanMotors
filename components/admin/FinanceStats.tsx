"use client";

import { useVehicles } from "@/lib/vehicle-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Tag, TrendingUp, ShoppingCart } from "lucide-react";

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
    let activeListPrice = 0; // Added to show Potential Revenue
    let activeCount = 0;

    vehicles.forEach(v => {
        // Calculate Cost for Active (Available, Reserved, Pending) vehicles only
        // Note: Sold items are excluded from Active Inventory Assets
        if (v.status !== 'Sold') {
            const purchase = v.purchasePrice || 0;
            const expenses = v.expenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;
            const price = v.price || 0;

            activePurchase += purchase;
            activeExpenses += expenses;
            activeListPrice += price;
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

    // Dot Colors for new Minimal Design
    const getStatusDotColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'available': return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]';
            case 'sold': return 'bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.4)]';
            case 'reserved': return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]';
            case 'pending': return 'bg-orange-500';
            default: return 'bg-gray-400';
        }
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8 items-stretch select-none">
            {/* Status Breakdown Card - REDESIGNED */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-1 flex flex-col shadow-md border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Status</CardTitle>
                    <Tag className="h-4 w-4 text-muted-foreground opacity-70" />
                </CardHeader>
                <CardContent className="flex-1">
                    <div className="space-y-4 pt-1">
                        {definedStatuses.map((status) => (
                            <div key={status} className="flex items-center justify-between group cursor-default">
                                <div className="flex items-center gap-3">
                                    <span className={`h-2.5 w-2.5 rounded-full ring-2 ring-transparent transition-all group-hover:scale-110 ${getStatusDotColor(status)}`} />
                                    <span className="text-sm font-semibold text-foreground/80 group-hover:text-foreground transition-colors">
                                        {status}
                                    </span>
                                </div>
                                <span className="font-mono font-bold text-sm text-foreground/90 bg-muted/30 px-2 py-0.5 rounded-md min-w-[2rem] text-center">
                                    {statusCounts[status] || 0}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Total Inventory Cost (Active Only) */}
            <Card className="flex flex-col shadow-md border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Active Inventory Cost</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground opacity-70" />
                </CardHeader>
                <CardContent className="flex flex-col flex-1 justify-between gap-4">
                    <div>
                        <div className="text-2xl font-bold tracking-tight">${totalActiveCost.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-2 space-y-1">
                            <span className="flex justify-between">
                                <span>Purchase:</span>
                                <span>${activePurchase.toLocaleString()}</span>
                            </span>
                            <span className="flex justify-between">
                                <span>Expenses:</span>
                                <span>${activeExpenses.toLocaleString()}</span>
                            </span>
                            <span className="flex justify-between border-t border-border/50 pt-1 mt-1 font-medium text-foreground/70">
                                <span title="Total listing price of active vehicles">Est. Retail Value:</span>
                                <span>${activeListPrice.toLocaleString()}</span>
                            </span>
                        </p>
                    </div>
                    <div className="pt-4 border-t border-border/50 mt-auto">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">Avg Cost / Car</span>
                            <span className="font-medium">${avgActiveCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Total Sales (Realized) */}
            <Card className="flex flex-col shadow-md border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground opacity-70" />
                </CardHeader>
                <CardContent className="flex flex-col flex-1 justify-between gap-4">
                    <div>
                        <div className="text-2xl font-bold text-blue-600 tracking-tight">${realizedSale.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Realized from {soldCount} sold vehicles.
                        </p>
                    </div>
                    <div className="pt-4 border-t border-border/50 mt-auto">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">Avg Sale Price</span>
                            <span className="font-medium">${avgSale.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Net Profit (Realized) */}
            <Card className="flex flex-col shadow-md border-border/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit (Realized)</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground opacity-70" />
                </CardHeader>
                <CardContent className="flex flex-col flex-1 justify-between gap-4">
                    <div>
                        <div className={`text-2xl font-bold tracking-tight ${realizedProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${realizedProfit.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {realizedProfit >= 0 ? '+' : ''}{realizedCost > 0 ? ((realizedProfit / realizedCost) * 100).toFixed(1) : '∞'}% Margin
                        </p>
                    </div>
                    <div className="pt-4 border-t border-border/50 mt-auto">
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
