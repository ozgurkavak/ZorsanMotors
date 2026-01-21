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
    LayoutTemplate
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface InventoryDisplayProps {
    vehicles: Vehicle[];
}

export function InventoryDisplay({ vehicles }: InventoryDisplayProps) {
    const [columns, setColumns] = useState<3 | 4 | 5>(3);
    const [currentPage, setCurrentPage] = useState(1);

    // "3x5, 4x5, 5x5" logic implies 5 rows
    const rowsPerPage = 5;
    const itemsPerPage = columns * rowsPerPage;

    // Reset page when columns change to avoid empty pages
    const handleColumnChange = (cols: 3 | 4 | 5) => {
        setColumns(cols);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(vehicles.length / itemsPerPage);

    // Get current items
    const currentVehicles = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return vehicles.slice(start, start + itemsPerPage);
    }, [currentPage, itemsPerPage, vehicles]);

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(p => p - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(p => p + 1);
    };

    return (
        <div className="space-y-6">
            {/* Header / Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/50 p-4 rounded-xl border shadow-sm backdrop-blur-sm">
                <div className="text-sm font-medium text-muted-foreground">
                    Showing <span className="text-foreground font-bold">{vehicles.length}</span> vehicles
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground mr-2">Grid Layout:</span>
                    <div className="flex items-center bg-muted rounded-lg p-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-8 w-8 rounded-md transition-all", columns === 3 && "bg-background shadow-sm")}
                            onClick={() => handleColumnChange(3)}
                            title="3 Columns"
                        >
                            <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-8 w-8 rounded-md transition-all", columns === 4 && "bg-background shadow-sm")}
                            onClick={() => handleColumnChange(4)}
                            title="4 Columns"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("h-8 w-8 rounded-md transition-all", columns === 5 && "bg-background shadow-sm")}
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

                {vehicles.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-xl">
                        <p className="text-xl font-semibold">No vehicles found</p>
                        <p className="text-muted-foreground">Try adjusting your filters to see more results.</p>
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
