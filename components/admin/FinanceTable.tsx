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
import { Search, ExternalLink, ChevronDown, ArrowUp, ArrowDown, X, Settings2, FileDown, Printer, Columns } from "lucide-react";
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
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exportToCSV, exportToExcel, exportToPDF, printTable } from "@/lib/export-utils";

type SortConfig = {
    key: 'purchase' | 'price' | null;
    direction: 'asc' | 'desc' | 'default';
};

export function FinanceTable() {
    const { vehicles, updateVehicle, refreshVehicles } = useVehicles();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [editingExpensesVehicle, setEditingExpensesVehicle] = useState<Vehicle | null>(null);
    const [activeTab, setActiveTab] = useState("Available");

    // Sorting
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'default' });

    // Column Widths
    const [colWidths, setColWidths] = useState({
        purchase: 140,
        price: 140
    });

    // Resize Logic
    const [resizing, setResizing] = useState<{ col: 'purchase' | 'price', startX: number, startWidth: number } | null>(null);

    // Column Visibility Settings
    const allColumns = [
        { id: 'stock', label: 'Stock #', default: true },
        { id: 'vehicle', label: 'Vehicle', default: true },
        { id: 'auction', label: 'Auction', default: true },
        { id: 'status', label: 'Status', default: true },
        { id: 'purchase', label: 'Purchase Price', default: true },
        { id: 'expenses', label: 'Expenses', default: true },
        { id: 'totalCost', label: 'Total Cost', default: true },
        { id: 'price', label: 'Sale Price', default: true },
        { id: 'profit', label: 'Net Profit', default: true },
    ];

    // Load settings from localStorage or default
    const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumns.map(c => c.id));

    useEffect(() => {
        const saved = localStorage.getItem('zorsan_settings_finance_cols');
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
        localStorage.setItem('zorsan_settings_finance_cols', JSON.stringify(newCols));
    };


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
        .filter(v => {
            if (activeTab === 'All') return true;
            // Case insensitive match
            return (v.status || 'Available') === activeTab;
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

    const handleUpdateString = async (id: string, field: keyof Vehicle, value: string) => {
        try {
            await updateVehicle(id, { [field]: value });
        } catch (e) {
            console.error("Failed to update string", e);
        }
    };

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

    const handleExport = (type: 'csv' | 'excel' | 'pdf') => {
        const dataToExport = displayedVehicles.map(v => {
            const { purchase, expenses, totalCost, sale, profit } = calculateFinancials(v);
            return {
                StockNumber: v.stockNumber,
                Make: v.make,
                Model: v.model,
                Year: v.year,
                Auction: v.auctionName,
                Status: v.status,
                PurchasePrice: purchase,
                Expenses: expenses,
                TotalCost: totalCost,
                SalePrice: sale,
                NetProfit: profit
            };
        });

        const filename = `Finance_Report_${new Date().toISOString().split('T')[0]}`;

        if (type === 'csv') exportToCSV(dataToExport, filename);
        if (type === 'excel') exportToExcel(dataToExport, filename);
        if (type === 'pdf') {
            const headers = ['Stock', 'Vehicle', 'Auction', 'Status', 'Purchase', 'Exp', 'Cost', 'Price', 'Profit'];
            const rows = displayedVehicles.map(v => {
                const { purchase, expenses, totalCost, sale, profit } = calculateFinancials(v);
                return [
                    v.stockNumber,
                    `${v.year} ${v.make}`,
                    v.auctionName,
                    v.status,
                    `$${purchase.toLocaleString()}`,
                    `$${expenses.toLocaleString()}`,
                    `$${totalCost.toLocaleString()}`,
                    `$${sale.toLocaleString()}`,
                    `$${profit.toLocaleString()}`
                ];
            });
            exportToPDF(headers, rows, 'Financial Report', filename);
        }
    };

    const handlePrintRequest = () => {
        const headers = ['Stock', 'Vehicle', 'Auction', 'Status', 'Purchase', 'Exp', 'Cost', 'Price', 'Profit'];
        const rows = displayedVehicles.map(v => {
            const { purchase, expenses, totalCost, sale, profit } = calculateFinancials(v);
            return [
                v.stockNumber || '-',
                `${v.year} ${v.make} ${v.model}`,
                v.auctionName || '-',
                `<span class="status-badge">${v.status || "Unknown"}</span>`,
                `$${purchase.toLocaleString()}`,
                `$${expenses.toLocaleString()}`,
                `$${totalCost.toLocaleString()}`,
                `$${sale.toLocaleString()}`,
                `$${profit.toLocaleString()}`
            ];
        });
        printTable("Financial Report", headers, rows);
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
                {/* Buttons Group (Left) */}
                <div className="flex gap-2 w-full sm:w-auto">
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
                        <DropdownMenuContent align="start">
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
                        <DropdownMenuContent align="start" className="w-[180px]">
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

                {/* Search Group (Right) */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <div className="text-sm font-medium text-muted-foreground whitespace-nowrap mr-2">
                        Total: <span className="text-foreground">{displayedVehicles.length}</span>
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search Stock, Vehicle..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Tabs Row */}
            <div className="px-6 pb-4 pt-2 border-b bg-muted/20">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full sm:w-auto flex overflow-x-auto justify-start h-auto p-1 bg-background border">
                        <TabsTrigger value="All">All</TabsTrigger>
                        <TabsTrigger value="Available">Available</TabsTrigger>
                        <TabsTrigger value="Sold">Sold</TabsTrigger>
                        <TabsTrigger value="Reserved">Reserved</TabsTrigger>
                        <TabsTrigger value="Pending">Pending</TabsTrigger>
                        <TabsTrigger value="Hidden">Hidden</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            <div className="relative w-full overflow-auto">
                <Table className="border-collapse">
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-b">
                            {visibleColumns.includes('stock') && <TableHead className="w-[80px] border-r border-border/50">Stock #</TableHead>}
                            {visibleColumns.includes('vehicle') && <TableHead className="min-w-[250px] border-r border-border/50">Vehicle</TableHead>}
                            {visibleColumns.includes('auction') && <TableHead className="min-w-[150px] border-r border-border/50">Auction</TableHead>}
                            {visibleColumns.includes('status') && <TableHead className="w-[100px] border-r border-border/50">Status</TableHead>}

                            {/* Purchase Column */}
                            {visibleColumns.includes('purchase') && (
                                <TableHead className="w-[110px] text-right p-0 relative border-r border-border/50">
                                    <div className="h-12 flex items-center justify-end pr-2">
                                        Purchase
                                    </div>
                                </TableHead>
                            )}

                            {visibleColumns.includes('expenses') && <TableHead className="w-[100px] text-right border-r border-border/50">Exp.</TableHead>}
                            {visibleColumns.includes('totalCost') && <TableHead className="w-[110px] text-right border-r border-border/50">Cost</TableHead>}

                            {/* Sale Column */}
                            {visibleColumns.includes('price') && (
                                <TableHead className="w-[110px] text-right p-0 relative border-r border-border/50">
                                    <div className="h-12 flex items-center justify-end pr-2">
                                        Price
                                    </div>
                                </TableHead>
                            )}

                            {visibleColumns.includes('profit') && <TableHead className="w-[110px] text-right">Profit</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {displayedVehicles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={visibleColumns.length} className="h-24 text-center">
                                    No records found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            displayedVehicles.map((vehicle) => {
                                const { purchase, expenses, totalCost, sale, profit } = calculateFinancials(vehicle);

                                return (
                                    <TableRow key={vehicle.id} className="hover:bg-muted/50 border-b border-border/50">
                                        {visibleColumns.includes('stock') && (
                                            <TableCell className="font-mono font-medium text-xs border-r border-border/50">
                                                {vehicle.stockNumber || "-"}
                                            </TableCell>
                                        )}

                                        {visibleColumns.includes('vehicle') && (
                                            <TableCell
                                                className="cursor-pointer border-r border-border/50"
                                                onClick={() => router.push(`/zm-console/finance/${vehicle.id}`)}
                                            >
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-blue-600 hover:underline flex items-center gap-1">
                                                        {vehicle.year} {vehicle.make} {vehicle.model}
                                                        <ExternalLink className="w-3 h-3 opacity-50" />
                                                    </span>
                                                </div>
                                            </TableCell>
                                        )}

                                        {visibleColumns.includes('auction') && (
                                            <TableCell className="text-muted-foreground text-xs border-r border-border/50 p-0">
                                                <Input
                                                    className="h-full px-2 text-center bg-transparent border-transparent hover:border-input focus:border-input transition-colors rounded-none w-full text-xs"
                                                    defaultValue={vehicle.auctionName || ""}
                                                    placeholder="-"
                                                    onBlur={(e) => handleUpdateString(vehicle.id, 'auctionName', e.target.value)}
                                                />
                                            </TableCell>
                                        )}

                                        {visibleColumns.includes('status') && (
                                            <TableCell className="border-r border-border/50">
                                                <StatusSelector vehicle={vehicle} />
                                            </TableCell>
                                        )}

                                        {/* Editable Purchase Price */}
                                        {visibleColumns.includes('purchase') && (
                                            <TableCell className="text-right border-r border-border/50 p-0">
                                                <div className="flex justify-end h-full">
                                                    <Input
                                                        className="h-full px-2 text-right bg-transparent border-transparent hover:border-input focus:border-input transition-colors rounded-none"
                                                        style={{ width: '100%' }}
                                                        defaultValue={purchase > 0 ? purchase : ""}
                                                        placeholder="0"
                                                        onBlur={(e) => handleUpdatePrice(vehicle.id, 'purchasePrice', e.target.value)}
                                                    />
                                                </div>
                                            </TableCell>
                                        )}

                                        {/* Clickable Expenses -> Dialog */}
                                        {visibleColumns.includes('expenses') && (
                                            <TableCell className="text-right border-r border-border/50">
                                                <div
                                                    className="cursor-pointer hover:bg-muted p-1 transition-colors text-muted-foreground underline decoration-dotted"
                                                    onClick={() => setEditingExpensesVehicle(vehicle)}
                                                >
                                                    ${expenses.toLocaleString()}
                                                </div>
                                            </TableCell>
                                        )}

                                        {visibleColumns.includes('totalCost') && (
                                            <TableCell className="text-right font-medium border-r border-border/50">
                                                ${totalCost.toLocaleString()}
                                            </TableCell>
                                        )}

                                        {/* Editable Sale Price */}
                                        {visibleColumns.includes('price') && (
                                            <TableCell className="text-right border-r border-border/50 p-0">
                                                <div className="flex justify-end h-full">
                                                    <Input
                                                        className="h-full px-2 text-right bg-transparent border-transparent hover:border-input focus:border-input transition-colors rounded-none"
                                                        style={{ width: '100%' }}
                                                        defaultValue={sale > 0 ? sale : ""}
                                                        placeholder="-"
                                                        onBlur={(e) => handleUpdatePrice(vehicle.id, 'price', e.target.value)}
                                                    />
                                                </div>
                                            </TableCell>
                                        )}

                                        {visibleColumns.includes('profit') && (
                                            <TableCell className={`text-right font-bold ${profit >= 0 && sale > 0 ? 'text-green-600' : (sale > 0 && profit < 0) ? 'text-red-600' : 'text-muted-foreground'}`}>
                                                {sale > 0 ? `$${profit.toLocaleString()}` : '-'}
                                            </TableCell>
                                        )}
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
