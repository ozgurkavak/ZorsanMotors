"use client";

import { useState, useMemo } from "react";
import { Vehicle } from "@/types";
import { CarCard } from "@/components/inventory/CarCard";
import { Button } from "@/components/ui/button";
import {
    LayoutGrid,
    Grid3X3,
    Columns,
    ChevronLeft,
    ChevronRight,
    LayoutTemplate,
    Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface InventoryDisplayProps {
    vehicles: Vehicle[];
}

export function InventoryDisplay({ vehicles }: InventoryDisplayProps) {
    const [columns, setColumns] = useState<3 | 4 | 5>(3);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    // "3x5, 4x5, 5x5" logic implies 5 rows
    const rowsPerPage = 5;
    const itemsPerPage = columns * rowsPerPage;

    // Reset page when columns change to avoid empty pages
    const handleColumnChange = (cols: 3 | 4 | 5) => {
        setColumns(cols);
        setCurrentPage(1);
        setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 250);
    };

    const filteredVehicles = useMemo(() => {
        if (!searchQuery.trim()) return vehicles;
        const query = searchQuery.toLowerCase();
        return vehicles.filter(v => 
            v.make.toLowerCase().includes(query) ||
            v.model.toLowerCase().includes(query) ||
            v.year.toString().includes(query)
        );
    }, [vehicles, searchQuery]);

    const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);

    // Get current items
    const currentVehicles = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredVehicles.slice(start, start + itemsPerPage);
    }, [currentPage, itemsPerPage, filteredVehicles]);

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(p => p - 1);
            setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 250);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(p => p + 1);
            setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 250);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header / Controls */}
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-br from-card/90 to-card/50 p-5 rounded-2xl border border-primary/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md overflow-hidden">
                {/* Decorative background glow & highlights */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 blur-xl pointer-events-none" />
                
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                    <div className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                        Showing <span className="text-foreground font-bold text-base">{filteredVehicles.length}</span> vehicles
                    </div>
                    
                    <div className="relative w-full sm:max-w-xs rounded-xl bg-gradient-to-r from-primary/80 via-blue-400 to-primary/80 p-[3px] shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-shadow hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] group">
                        <div className="relative w-full h-full bg-background/90 backdrop-blur-sm rounded-lg overflow-hidden">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search make, model, year..."
                                className="flex h-10 w-full border-0 bg-transparent px-3 py-1 text-sm shadow-inner transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 pl-9"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground mr-2 uppercase tracking-wider">Layout</span>
                    <div className="flex items-center bg-background/50 rounded-lg p-1 border border-border/50 shadow-inner">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-8 w-8 rounded-md transition-all", columns === 3 && "bg-background shadow-md border border-border/50")}
                            onClick={() => handleColumnChange(3)}
                            title="3 Columns"
                        >
                            <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-8 w-8 rounded-md transition-all", columns === 4 && "bg-background shadow-md border border-border/50")}
                            onClick={() => handleColumnChange(4)}
                            title="4 Columns"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-8 w-8 rounded-md transition-all", columns === 5 && "bg-background shadow-md border border-border/50")}
                            onClick={() => handleColumnChange(5)}
                            title="5 Columns"
                        >
                            <Columns className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Grid Content */}
            <div className="min-h-[600px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPage + "-" + columns}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            "grid gap-4",
                            columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
                            columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                            columns === 5 && "grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                        )}
                    >
                        {currentVehicles.map((vehicle) => (
                            <CarCard key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </motion.div>
                </AnimatePresence>

                {filteredVehicles.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-xl">
                        <p className="text-xl font-semibold">No vehicles found</p>
                        <p className="text-muted-foreground">Try adjusting your search or filters to see more results.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-6 pt-8 border-t">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className="h-10 w-10"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-2 text-sm font-medium">
                        Page <span className="px-3 py-1 bg-primary/10 text-primary rounded-md border border-primary/20">{currentPage}</span> of {totalPages}
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className="h-10 w-10"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
