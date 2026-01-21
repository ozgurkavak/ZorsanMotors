"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Vehicle } from '@/types';
import { vehicles as initialVehicles } from '@/lib/mock-data';

interface VehicleContextType {
    vehicles: Vehicle[];
    addVehicle: (vehicle: Vehicle) => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export function VehicleProvider({ children }: { children: ReactNode }) {
    // Start with default mock data
    const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from LocalStorage on mount (Client-side only)
    useEffect(() => {
        const stored = localStorage.getItem('zorsanMotorsVehicles');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setVehicles(parsed);
            } catch (e) {
                console.error("Failed to parse stored vehicles", e);
            }
        }
        setIsInitialized(true);
    }, []);

    // Save to LocalStorage whenever vehicles change
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('zorsanMotorsVehicles', JSON.stringify(vehicles));
        }
    }, [vehicles, isInitialized]);

    const addVehicle = (newVehicle: Vehicle) => {
        setVehicles((prev) => [newVehicle, ...prev]);
    };

    return (
        <VehicleContext.Provider value={{ vehicles, addVehicle }}>
            {children}
        </VehicleContext.Provider>
    );
}

export function useVehicles() {
    const context = useContext(VehicleContext);
    if (context === undefined) {
        throw new Error('useVehicles must be used within a VehicleProvider');
    }
    return context;
}
