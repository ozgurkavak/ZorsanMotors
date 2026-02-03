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
import { Edit2, Trash2, DollarSign, MoreHorizontal, Search } from "lucide-react";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EditVehicleDialog } from "./EditVehicleDialog";
import { StatusSelector } from "./StatusSelector";
import { Vehicle } from "@/types";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ExpenseManager } from "./ExpenseManager";

export function InventoryTable({ limit }: { limit?: number }) {
    const { vehicles, deleteVehicle, updateVehicle } = useVehicles();
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
    const [managingVehicle, setManagingVehicle] = useState<Vehicle | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Filter and Limit
    const displayedVehicles = vehicles
        .filter(v => {
            if (!searchTerm) return true;
            const term = searchTerm.toLowerCase();
            const stock = v.stockNumber?.toLowerCase() || "";
            const title = `${v.make} ${v.model} ${v.year}`.toLowerCase();
            return stock.includes(term) || title.includes(term);
        })
        .slice(0, limit || vehicles.length);

    const handleDelete = async () => {
        if (deleteId) {
            await deleteVehicle(deleteId);
            setDeleteId(null);
        }
    };



    return (
        <div className="rounded-xl border bg-card shadow-sm">
            <div className="p-6 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="text-lg font-semibold">{limit ? "Recent Listings" : "Inventory Management"}</h3>
                    <p className="text-sm text-muted-foreground">{limit ? "Latest additions to your fleet." : "Manage all vehicles."}</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search Stock # or Car..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="relative w-full overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {!limit && <TableHead>Image</TableHead>}
                            <TableHead>Stock #</TableHead>
                            <TableHead>Vehicle</TableHead>
                            {!limit && <TableHead>Purchase</TableHead>}
                            {!limit && <TableHead>Cost</TableHead>}
                            {!limit && <TableHead>Profit</TableHead>}
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {displayedVehicles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={limit ? 7 : 10} className="h-24 text-center">
                                    No vehicles found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            displayedVehicles.map((vehicle) => {
                                const purchase = vehicle.purchasePrice || 0;
                                const expenses = vehicle.expenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;
                                const totalCost = purchase + expenses;
                                const sale = vehicle.price || 0;
                                const profit = sale - totalCost;

                                return (
                                    <TableRow key={vehicle.id}>
                                        {!limit && (
                                            <TableCell>
                                                <div className="h-12 w-20 rounded overflow-hidden bg-muted">
                                                    {vehicle.image && <img src={vehicle.image} alt={vehicle.model} className="h-full w-full object-cover object-center" />}
                                                </div>
                                            </TableCell>
                                        )}
                                        <TableCell className="font-mono font-medium text-xs">
                                            {vehicle.stockNumber || "-"}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {vehicle.year} {vehicle.make} {vehicle.model}
                                        </TableCell>

                                        {!limit && (
                                            <>
                                                <TableCell className="text-xs text-muted-foreground">
                                                    ${purchase.toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-xs font-medium">
                                                    ${totalCost.toLocaleString()}
                                                </TableCell>
                                                <TableCell className={`text-xs font-bold ${profit >= 0 && sale > 0 ? 'text-green-600' : (sale > 0 && profit < 0) ? 'text-red-600' : 'text-muted-foreground'}`}>
                                                    {sale > 0 ? `$${profit.toLocaleString()}` : '-'}
                                                </TableCell>
                                            </>
                                        )}

                                        <TableCell>${vehicle.price.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <StatusSelector vehicle={vehicle} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => setManagingVehicle(vehicle)}>
                                                        <DollarSign className="w-4 h-4 mr-2" />
                                                        Financials & Expenses
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => setEditingVehicle(vehicle)}>
                                                        <Edit2 className="w-4 h-4 mr-2" />
                                                        Edit Details
                                                    </DropdownMenuItem>

                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600" onClick={() => setDeleteId(vehicle.id)}>
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Delete Vehicle
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the vehicle from the database.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <EditVehicleDialog
                vehicle={editingVehicle}
                open={!!editingVehicle}
                onOpenChange={(open) => !open && setEditingVehicle(null)}
            />

            <Sheet open={!!managingVehicle} onOpenChange={(open) => !open && setManagingVehicle(null)}>
                <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                    <SheetHeader className="mb-6">
                        <SheetTitle>Financial Management</SheetTitle>
                        <SheetDescription>
                            {managingVehicle?.year} {managingVehicle?.make} {managingVehicle?.model} ({managingVehicle?.stockNumber})
                        </SheetDescription>
                    </SheetHeader>
                    {managingVehicle && <ExpenseManager vehicle={managingVehicle} />}
                </SheetContent>
            </Sheet>
        </div>
    );
}
