"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useVehicles } from "@/lib/vehicle-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, Car } from "lucide-react";
import { ExpenseManager } from "@/components/admin/ExpenseManager";

export default function FinanceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { vehicles, refreshVehicles, updateVehicle } = useVehicles();
    const [loading, setLoading] = useState(false);

    // Find Vehicle
    const vehicle = vehicles.find(v => v.id === params.id);

    // Local State for Form
    const [purchasePrice, setPurchasePrice] = useState("");
    const [salePrice, setSalePrice] = useState("");
    const [auctionName, setAuctionName] = useState("");
    const [saleDate, setSaleDate] = useState("");

    // Initialize state when vehicle loads
    useEffect(() => {
        if (vehicle) {
            setPurchasePrice(vehicle.purchasePrice?.toString() || "");
            setSalePrice(vehicle.salePrice?.toString() || "");
            setAuctionName(vehicle.auctionName || "");
            setSaleDate(vehicle.soldDate ? new Date(vehicle.soldDate).toISOString().split('T')[0] : "");
        }
    }, [vehicle]);

    if (!vehicle) {
        return <div className="p-8">Loading vehicle data...</div>;
    }

    // Calculations
    const purchase = parseFloat(purchasePrice) || 0;
    const sale = parseFloat(salePrice) || 0;
    const expensesList = vehicle.expenses || [];
    const totalExpenses = expensesList.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const totalCost = purchase + totalExpenses;
    const profit = sale > 0 ? sale - totalCost : 0; // Net Profit

    const handleSaveFinancials = async () => {
        setLoading(true);
        try {
            await updateVehicle(vehicle.id, {
                purchasePrice: purchasePrice ? parseFloat(purchasePrice) : 0,
                salePrice: salePrice ? parseFloat(salePrice) : 0,
                auctionName: auctionName,
                soldDate: saleDate || undefined
            });
            await refreshVehicles();
            alert("Financials Saved!");
        } catch (e) {
            console.error(e);
            alert("Error saving.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header / Nav */}
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                        <Badge variant="outline">{vehicle.stockNumber}</Badge>
                    </h1>
                    <p className="text-muted-foreground text-sm">{vehicle.vin}</p>
                </div>
                <div className="ml-auto flex gap-2">
                    <Badge className="text-lg px-4 py-1" variant={profit >= 0 ? "default" : "destructive"}>
                        {sale > 0 ? `Net Profit: $${profit.toLocaleString()}` : "Not Sold Yet"}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* COLUMN 1: Vehicle & Acquisition */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-0 overflow-hidden">
                            {vehicle.image ? (
                                <div className="h-48 w-full bg-muted">
                                    <img
                                        src={vehicle.image}
                                        className="h-full w-full object-cover"
                                        onError={(e) => { e.currentTarget.src = "/placeholder.png"; e.currentTarget.onerror = null; }}
                                    />
                                </div>
                            ) : (
                                <div className="h-48 w-full bg-muted flex items-center justify-center">
                                    <Car className="h-12 w-12 text-muted-foreground" />
                                </div>
                            )}
                            <div className="p-4 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Status</span>
                                    <p className="font-medium">{vehicle.status}</p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Mileage</span>
                                    <p className="font-medium">{vehicle.mileage.toLocaleString()} mi</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Acquisition Cost</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label>Auction Name</Label>
                                <Input
                                    placeholder="e.g. Manheim"
                                    value={auctionName}
                                    onChange={e => setAuctionName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Purchase Price ($)</Label>
                                <Input
                                    type="number"
                                    value={purchasePrice}
                                    onChange={e => setPurchasePrice(e.target.value)}
                                />
                            </div>
                            <Separator />
                            <div className="flex justify-between font-medium">
                                <span>Purchase Price</span>
                                <span>${purchase.toLocaleString()}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Sales Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label>Sale Price ($)</Label>
                                <Input
                                    type="number"
                                    value={salePrice}
                                    onChange={e => setSalePrice(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Sold Date</Label>
                                <Input
                                    type="date"
                                    value={saleDate}
                                    onChange={e => setSaleDate(e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Button className="w-full" size="lg" onClick={handleSaveFinancials} disabled={loading}>
                        <Save className="w-4 h-4 mr-2" /> Save All Financials
                    </Button>
                </div>

                {/* COLUMN 2 & 3: Expenses and Summary */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Summary Bar */}
                    <div className="grid grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="p-6">
                                <span className="text-sm text-muted-foreground">Total Cost</span>
                                <p className="text-2xl font-bold">${totalCost.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">Purchase + Expenses</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <span className="text-sm text-muted-foreground">Total Expenses</span>
                                <p className="text-2xl font-bold text-orange-600">${totalExpenses.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">{expensesList.length} items</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <span className="text-sm text-muted-foreground">Price</span>
                                <p className="text-2xl font-bold text-primary">${(vehicle.price || 0).toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">Listing Price</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Expenses Table */}
                    <ExpenseManager vehicle={vehicle} />
                </div>
            </div>
        </div>
    );
}
