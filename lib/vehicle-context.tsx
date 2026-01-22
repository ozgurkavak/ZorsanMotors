"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Vehicle } from '@/types';
import { supabase } from '@/lib/supabase';


interface VehicleContextType {
    vehicles: Vehicle[];
    addVehicle: (vehicle: Vehicle) => Promise<void>;
    deleteVehicle: (id: string) => Promise<void>;
    updateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<void>;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export function VehicleProvider({ children }: { children: ReactNode }) {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        const { data, error } = await supabase
            .from('vehicles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching vehicles:', error);
            return;
        }

        if (data) {
            const mappedVehicles: Vehicle[] = data.map((v: any) => ({
                id: v.id,
                vin: v.vin,
                make: v.make,
                model: v.model,
                year: v.year,
                price: v.price,
                mileage: v.mileage,
                bodyType: v.body_type,
                fuelType: v.fuel_type,
                transmission: v.transmission,
                image: v.image_url,
                condition: v.mileage < 30000 ? "Certified Pre-Owned" : "Used",
                exteriorColor: v.exterior_color,
                interiorColor: v.interior_color,
                features: v.features,
                carfaxUrl: v.carfax_url || `/carfax-report/${v.id}`,
                status: v.status
            }));
            setVehicles(mappedVehicles);
        }
    };

    const addVehicle = async (newVehicle: Vehicle) => {
        // Map frontend CamelCase to DB snake_case
        const dbVehicle = {
            make: newVehicle.make,
            model: newVehicle.model,
            year: newVehicle.year,
            price: newVehicle.price,
            mileage: newVehicle.mileage,
            body_type: newVehicle.bodyType,
            fuel_type: newVehicle.fuelType,
            transmission: newVehicle.transmission,
            image_url: newVehicle.image,
            exterior_color: newVehicle.exteriorColor,
            interior_color: newVehicle.interiorColor,
            vin: newVehicle.vin,
            features: newVehicle.features,
            drivetrain: "FWD",
            status: newVehicle.status || "Available"
        };

        const { data, error } = await supabase
            .from('vehicles')
            .insert([dbVehicle])
            .select()
            .single();

        if (error) {
            console.error('Error adding vehicle:', error);
            throw error;
        }

        if (data) {
            // Re-fetch or add directly. Re-fetching ensures ID matches.
            // For speed let's just create object, but data.id is key.
            fetchVehicles();
        }
    };

    const deleteVehicle = async (id: string) => {
        const { error } = await supabase
            .from('vehicles')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting vehicle:', error);
            throw error;
        }

        setVehicles((prev) => prev.filter((v) => v.id !== id));
    };

    const updateVehicle = async (id: string, updates: Partial<Vehicle>) => {
        // Simple mapping for status/price which are likely updates
        const dbUpdates: any = {};
        if (updates.status) dbUpdates.status = updates.status;
        if (updates.price) dbUpdates.price = updates.price;
        // Add more mappings as needed for edit form

        const { error } = await supabase
            .from('vehicles')
            .update(dbUpdates)
            .eq('id', id);

        if (error) {
            console.error('Error updating vehicle:', error);
            throw error;
        }

        // Optimistic update
        setVehicles((prev) => prev.map(v => v.id === id ? { ...v, ...updates } : v));
    };

    return (
        <VehicleContext.Provider value={{ vehicles, addVehicle, deleteVehicle, updateVehicle }}>
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
