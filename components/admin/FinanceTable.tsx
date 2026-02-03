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
import { Search, ExternalLink, ChevronDown, ArrowUp, ArrowDown, X, Settings2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Vehicle } from "@/types";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExpenseManager } from "@/components/admin/ExpenseManager";
import { StatusSelector } from "./StatusSelector";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SortConfig = {
    key: 'purchase' | 'price' | null;
    direction: 'asc' | 'desc' | 'default';
};

export function FinanceTable() {
    const { vehicles, updateVehicle, refreshVehicles } = useVehicles();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [editingExpensesVehicle, setEditingExpensesVehicle] = useState<Vehicle | null>(null);

    // Sorting
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'default' });

    // Column Widths
    const [colWidths, setColWidths] = useState({
        purchase: 140,
        price: 140
    });

    // Resize Logic
    const [resizing, setResizing] = useState<{ col: 'purchase' | 'price', startX: number, startWidth: number } | null>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!resizing) return;
            const diff = e.clientX - resizing.startX;
            setColWidths(prev => ({
                ...prev,
                [resizing.col]: Math.max(100, resizing.startWidth + diff)
            }));
        };
        const handleMouseUp = () => {
            setResizing(null);
        };
        if (resizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [resizing]);


    // Filter & Sort
    const displayedVehicles = vehicles
        .filter(v => {
            if (!searchTerm) return true;
            const term = searchTerm.toLowerCase();
            const stock = v.stockNumber?.toLowerCase() || "";
            const title = `${v.make} ${v.model} ${v.year}`.toLowerCase();
            const auction = v.auctionName?.toLowerCase() || "";
            return stock.includes(term) || title.includes(term) || auction.includes(term);
        })
        .sort((a, b) => {
            // Custom Sorting for Purchase & Sale
            if (sortConfig.key && sortConfig.direction !== 'default') {
                const valA = sortConfig.key === 'purchase' ? (a.purchasePrice || 0) : (a.price || 0);
                const valB = sortConfig.key === 'purchase' ? (b.purchasePrice || 0) : (b.price || 0);

                if (sortConfig.direction === 'asc') return valA - valB;
                if (sortConfig.direction === 'desc') return valB - valA;
            }

            // Default Sort: Created At Desc + Stock Number (Stable)
            const dateA = new Date(a.createdAt || "").getTime();
            const dateB = new Date(b.createdAt || "").getTime();

            if (dateA !== dateB) return dateB - dateA;
            return (b.stockNumber || "").localeCompare(a.stockNumber || "");
        });

    const calculateFinancials = (vehicle: Vehicle) => {
        const purchase = vehicle.purchasePrice || 0;
        const expenses = vehicle.expenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;
        const totalCost = purchase + expenses;
        const sale = vehicle.price || 0;
        const profit = sale - totalCost;
        return { purchase, expenses, totalCost, sale, profit };
    }

    const handleUpdatePrice = async (id: string, field: 'purchasePrice' | 'price', value: string) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return;

        try {
            await updateVehicle(id, { [field]: numValue });
            await refreshVehicles();
        } catch (e) {
            console.error("Failed to update price", e);
        }
    };

    // Helper for Sort Header
    const SortableHeader = ({ title, colKey }: { title: string, colKey: 'purchase' | 'price' }) => {
        const currentSort = sortConfig.key === colKey ? sortConfig.direction : 'default';

        return (
            <div className="flex items-center justify-end h-full w-full relative group">
                <div className="flex items-center gap-1 pr-4"> {/* Added padding directly to content content */}
                    {title}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 p-0 hover:bg-slate-200 ml-1">
                                <ChevronDown className={`h-3 w-3 ${currentSort !== 'default' ? 'text-blue-600 font-bold' : 'text-muted-foreground opacity-50'}`} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSortConfig({ key: colKey, direction: 'asc' })}>
                                <ArrowUp className="mr-2 h-4 w-4 text-muted-foreground" /> Ascending
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortConfig({ key: colKey, direction: 'desc' })}>
                                <ArrowDown className="mr-2 h-4 w-4 text-muted-foreground" /> Descending
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortConfig({ key: null, direction: 'default' })}>
                                <X className="mr-2 h-4 w-4 text-muted-foreground" /> Default
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Resize Handle - Aligned with Border */}
                <div
                    className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 group-hover:bg-blue-400/50 transition-colors z-10"
                    onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setResizing({ col: colKey, startX: e.clientX, startWidth: colWidths[colKey] });
                    }}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        );
    };

    return (
        <div className="rounded-xl border bg-card shadow-sm">
            <div className="p-6 border-b flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search Stock, Vehicle..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Table View Settings Button */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0">
                                <Settings2 className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuItem disabled>
                                Configuration coming soon...
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                    Showing {displayedVehicles.length} vehicles
                </div>
            </div>
            <div className="relative w-full overflow-auto">
                <Table className="border-collapse">
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b">
                            <TableHead className="w-[100px] border-r border-border/50">Stock #</TableHead>
                            <TableHead className="w-[200px] border-r border-border/50">Vehicle</TableHead>
                            <TableHead className="w-[150px] border-r border-border/50">Auction</TableHead>
                            <TableHead className="w-[100px] border-r border-border/50">Status</TableHead>

                            {/* Purchase Column */}
                            <TableHead className="text-right p-0 relative border-r border-border/50" style={{ width: colWidths.purchase }}>
                                <div className="h-12 flex items-center justify-end">
                                    <SortableHeader title="Purchase" colKey="purchase" />
                                </div>
                            </TableHead>

                            <TableHead className="min-w-[120px] text-right border-r border-border/50">Expenses</TableHead>
                            <TableHead className="min-w-[120px] text-right border-r border-border/50">Total Cost</TableHead>

                            {/* Sale Column */}
                            <TableHead className="text-right p-0 relative border-r border-border/50" style={{ width: colWidths.price }}>
                                <div className="h-12 flex items-center justify-end">
                                    <SortableHeader title="Sale Price" colKey="price" />
                                </div>
                            </TableHead>

                            <TableHead className="min-w-[120px] text-right">Net Profit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {displayedVehicles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="h-24 text-center">
                                    No records found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            displayedVehicles.map((vehicle) => {
                                const { purchase, expenses, totalCost, sale, profit } = calculateFinancials(vehicle);

                                return (
                                    <TableRow key={vehicle.id} className="hover:bg-muted/50 border-b border-border/50">
                                        <TableCell className="font-mono font-medium text-xs border-r border-border/50">
                                            {vehicle.stockNumber || "-"}
                                        </TableCell>

                                        <TableCell
                                            className="font-medium cursor-pointer text-blue-600 hover:underline flex items-center gap-1 border-r border-border/50"
                                            onClick={() => router.push(`/zm-console/finance/${vehicle.id}`)}
                                        >
                                            {vehicle.year} {vehicle.make}
                                            <ExternalLink className="w-3 h-3 opacity-50" />
                                        </TableCell>

                                        <TableCell className="text-muted-foreground text-xs border-r border-border/50">
                                            {vehicle.auctionName || "-"}
                                        </TableCell>

                                        <TableCell className="border-r border-border/50">
                                            <StatusSelector vehicle={vehicle} />
                                        </TableCell>

                                        {/* Editable Purchase Price */}
                                        <TableCell className="text-right border-r border-border/50 p-0">
                                            <div className="flex justify-end h-full">
                                                <Input
                                                    className="h-full px-4 text-right bg-transparent border-transparent hover:border-input focus:border-input transition-colors rounded-none"
                                                    style={{ width: '100%' }}
                                                    defaultValue={purchase > 0 ? purchase : ""}
                                                    placeholder="0"
                                                    onBlur={(e) => handleUpdatePrice(vehicle.id, 'purchasePrice', e.target.value)}
                                                />
                                            </div>
                                        </TableCell>

                                        {/* Clickable Expenses -> Dialog */}
                                        <TableCell className="text-right border-r border-border/50">
                                            <div
                                                className="cursor-pointer hover:bg-muted p-1 transition-colors text-muted-foreground underline decoration-dotted"
                                                onClick={() => setEditingExpensesVehicle(vehicle)}
                                            >
                                                ${expenses.toLocaleString()}
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-right font-medium border-r border-border/50">
                                            ${totalCost.toLocaleString()}
                                        </TableCell>

                                        {/* Editable Sale Price */}
                                        <TableCell className="text-right border-r border-border/50 p-0">
                                            <div className="flex justify-end h-full">
                                                <Input
                                                    className="h-full px-4 text-right bg-transparent border-transparent hover:border-input focus:border-input transition-colors rounded-none"
                                                    style={{ width: '100%' }}
                                                    defaultValue={sale > 0 ? sale : ""}
                                                    placeholder="-"
                                                    onBlur={(e) => handleUpdatePrice(vehicle.id, 'price', e.target.value)}
                                                />
                                            </div>
                                        </TableCell>

                                        <TableCell className={`text-right font-bold ${profit >= 0 && sale > 0 ? 'text-green-600' : (sale > 0 && profit < 0) ? 'text-red-600' : 'text-muted-foreground'}`}>
                                            {sale > 0 ? `$${profit.toLocaleString()}` : '-'}
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Expenses Dialog */}
            <Dialog open={!!editingExpensesVehicle} onOpenChange={(open) => !open && setEditingExpensesVehicle(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Expenses for {editingExpensesVehicle?.stockNumber}</DialogTitle>
                    </DialogHeader>
                    {editingExpensesVehicle && (
                        <ExpenseManager vehicle={editingExpensesVehicle} compact={true} />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
