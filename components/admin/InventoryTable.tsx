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
import { Edit2, Trash2, DollarSign, MoreHorizontal, Search, Settings2, FileDown, Printer, Columns } from "lucide-react";
import { useState, useEffect } from "react";
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
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportToCSV, exportToExcel, exportToPDF, printTable } from "@/lib/export-utils";

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
    const [activeTab, setActiveTab] = useState("active");

    // Column Visibility Settings
    const allColumns = [
        { id: 'image', label: 'Image', default: true },
        { id: 'stock', label: 'Stock #', default: true },
        { id: 'vehicle', label: 'Vehicle', default: true },
        { id: 'purchase', label: 'Purchase Price', default: true },
        { id: 'cost', label: 'Total Cost', default: true },
        { id: 'profit', label: 'Net Profit', default: true },
        { id: 'price', label: 'Listing Price', default: true },
        { id: 'status', label: 'Status', default: true },
        { id: 'actions', label: 'Actions', default: true },
    ];

    // Load settings from localStorage or default
    const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumns.map(c => c.id));

    useEffect(() => {
        const saved = localStorage.getItem('zorsan_settings_inventory_cols');
        if (saved) {
            try {
                setVisibleColumns(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse settings", e);
            }
        }
    }, []);

    const toggleColumn = (id: string, checked: boolean) => {
        const newCols = checked
            ? [...visibleColumns, id]
            : visibleColumns.filter(c => c !== id);

        setVisibleColumns(newCols);
        localStorage.setItem('zorsan_settings_inventory_cols', JSON.stringify(newCols));
    };

    // Filter and Limit
    const displayedVehicles = vehicles
        .filter(v => {
            if (!searchTerm) return true;
            const term = searchTerm.toLowerCase();
            const stock = v.stockNumber?.toLowerCase() || "";
            const title = `${v.make} ${v.model} ${v.year}`.toLowerCase();
            return stock.includes(term) || title.includes(term);
        })
        .filter(v => {
            if (limit) return v.status !== 'Sold'; // Widget shows only active
            if (activeTab === 'sold') return v.status === 'Sold';
            return v.status !== 'Sold'; // Active tab
        })
        .sort((a, b) => {
            // Sort Sold items by Sold Date (desc) if available, else standard
            if (activeTab === 'sold' && a.soldDate && b.soldDate) {
                return new Date(b.soldDate).getTime() - new Date(a.soldDate).getTime();
            }
            return 0;
        })
        .slice(0, limit || vehicles.length);

    const handleExport = (type: 'csv' | 'excel' | 'pdf') => {
        const dataToExport = displayedVehicles.map(v => ({
            StockNumber: v.stockNumber,
            Make: v.make,
            Model: v.model,
            Year: v.year,
            Status: v.status,
            Price: v.price,
            PurchasePrice: v.purchasePrice || 0,
            Expenses: v.expenses?.reduce((s, e) => s + e.amount, 0) || 0,
            TotalCost: (v.purchasePrice || 0) + (v.expenses?.reduce((s, e) => s + e.amount, 0) || 0),
            NetProfit: v.price - ((v.purchasePrice || 0) + (v.expenses?.reduce((s, e) => s + e.amount, 0) || 0))
        }));

        const filename = `Inventory_Report_${new Date().toISOString().split('T')[0]}`;

        if (type === 'csv') exportToCSV(dataToExport, filename);
        if (type === 'excel') exportToExcel(dataToExport, filename);
        if (type === 'pdf') {
            const headers = ['Stock', 'Make', 'Model', 'Year', 'Status', 'Price', 'Profit'];
            const rows = displayedVehicles.map(v => {
                const cost = (v.purchasePrice || 0) + (v.expenses?.reduce((s, e) => s + e.amount, 0) || 0);
                const profit = v.price - cost;
                return [v.stockNumber, v.make, v.model, v.year, v.status, `$${v.price}`, `$${profit}`];
            });
            exportToPDF(headers, rows, 'Inventory Report', filename);
        }
    };

    const handlePrintRequest = () => {
        const headers = ['Image', 'Stock', 'Vehicle', 'Year', 'Cost', 'Price', 'Status'];
        const rows = displayedVehicles.map(v => {
            const purchase = v.purchasePrice || 0;
            const expenses = v.expenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;
            const totalCost = purchase + expenses;
            const imageHtml = v.image ? `<img src="${v.image}" onerror="this.src='/placeholder.png'" />` : '';

            return [
                imageHtml,
                v.stockNumber || '-',
                `${v.make} ${v.model}`,
                v.year,
                `$${totalCost.toLocaleString()}`,
                `$${v.price.toLocaleString()}`,
                `<span class="status-badge">${v.status}</span>`
            ];
        });
        printTable("Inventory Report", headers, rows);
    };

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
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    {!limit && (
                        <div className="flex items-center gap-2">
                            {/* Export & Settings */}
                            <div className="flex gap-2 mr-2">
                                <Button variant="outline" size="sm" onClick={handlePrintRequest} title="Print Table">
                                    <Printer className="w-4 h-4" />
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <FileDown className="w-4 h-4 mr-2" />
                                            Export
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Export Data</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => handleExport('csv')}>Download CSV</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleExport('excel')}>Download Excel</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleExport('pdf')}>Download PDF</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Columns className="w-4 h-4 mr-2" />
                                            Columns
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[180px]">
                                        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {allColumns.map(col => (
                                            <DropdownMenuCheckboxItem
                                                key={col.id}
                                                checked={visibleColumns.includes(col.id)}
                                                onCheckedChange={(checked) => toggleColumn(col.id, checked)}
                                            >
                                                {col.label}
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList>
                                    <TabsTrigger value="active">Active</TabsTrigger>
                                    <TabsTrigger value="sold">Sold</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    )}
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
                            {!limit && visibleColumns.includes('image') && <TableHead>Image</TableHead>}
                            {(limit || visibleColumns.includes('stock')) && <TableHead>Stock #</TableHead>}
                            {(limit || visibleColumns.includes('vehicle')) && <TableHead>Vehicle</TableHead>}
                            {!limit && visibleColumns.includes('purchase') && <TableHead>Purchase</TableHead>}
                            {!limit && visibleColumns.includes('cost') && <TableHead>Cost</TableHead>}
                            {!limit && visibleColumns.includes('profit') && <TableHead>Profit</TableHead>}
                            {(limit || visibleColumns.includes('price')) && <TableHead>Price</TableHead>}
                            {(limit || visibleColumns.includes('status')) && <TableHead>Status</TableHead>}
                            {(limit || visibleColumns.includes('actions')) && <TableHead className="text-right">Actions</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {displayedVehicles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={limit ? 4 : visibleColumns.length} className="h-24 text-center">
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
                                        {!limit && visibleColumns.includes('image') && (
                                            <TableCell>
                                                <div className="h-12 w-20 rounded overflow-hidden bg-muted">
                                                    {vehicle.image && (
                                                        <img
                                                            src={vehicle.image}
                                                            alt={vehicle.model}
                                                            className="h-full w-full object-cover object-center"
                                                            onError={(e) => { e.currentTarget.src = "/placeholder.png"; e.currentTarget.onerror = null; }}
                                                        />
                                                    )}
                                                </div>
                                            </TableCell>
                                        )}
                                        {(limit || visibleColumns.includes('stock')) && (
                                            <TableCell className="font-mono font-medium text-xs">
                                                {vehicle.stockNumber || "-"}
                                            </TableCell>
                                        )}
                                        {(limit || visibleColumns.includes('vehicle')) && (
                                            <TableCell className="font-medium">
                                                {vehicle.year} {vehicle.make} {vehicle.model}
                                            </TableCell>
                                        )}

                                        {!limit && visibleColumns.includes('purchase') && (
                                            <TableCell className="text-xs text-muted-foreground">
                                                ${purchase.toLocaleString()}
                                            </TableCell>
                                        )}
                                        {!limit && visibleColumns.includes('cost') && (
                                            <TableCell className="text-xs font-medium">
                                                ${totalCost.toLocaleString()}
                                            </TableCell>
                                        )}
                                        {!limit && visibleColumns.includes('profit') && (
                                            <TableCell className={`text-xs font-bold ${profit >= 0 && sale > 0 ? 'text-green-600' : (sale > 0 && profit < 0) ? 'text-red-600' : 'text-muted-foreground'}`}>
                                                {sale > 0 ? `$${profit.toLocaleString()}` : '-'}
                                            </TableCell>
                                        )}

                                        {(limit || visibleColumns.includes('price')) && (
                                            <TableCell>${vehicle.price.toLocaleString()}</TableCell>
                                        )}
                                        {(limit || visibleColumns.includes('status')) && (
                                            <TableCell>
                                                <StatusSelector vehicle={vehicle} />
                                            </TableCell>
                                        )}
                                        {(limit || visibleColumns.includes('actions')) && (
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
                                        )}
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
