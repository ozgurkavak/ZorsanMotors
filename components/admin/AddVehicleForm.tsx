"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, CheckCircle2 } from "lucide-react";

// Schema
const vehicleSchema = z.object({
    make: z.string().min(2, "Make is required"),
    model: z.string().min(2, "Model is required"),
    year: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 1900, "Valid year required"),
    price: z.string().min(1, "Price is required"),
    vin: z.string().min(17, "VIN must be 17 characters").max(17),
    mileage: z.string().min(1, "Mileage is required"),
    status: z.enum(["Available", "Sold", "Reserved"]),
    image: z.any().optional(), // File upload simulation
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

import { useVehicles } from "@/lib/vehicle-context"; // Import hook
import { Vehicle } from "@/types"; // Import type

// ... imports

export function AddVehicleForm() {
    const { addVehicle } = useVehicles(); // Use hook
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const form = useForm<VehicleFormValues>({
        // ... resolver
        defaultValues: {
            make: "",
            model: "",
            year: "",
            price: "",
            vin: "",
            mileage: "",
            status: "Available",
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
        }
    };

    const onSubmit = async (data: VehicleFormValues) => {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Create new vehicle object
        const newVehicle: Vehicle = {
            id: Math.random().toString(36).substr(2, 9), // Generate temp ID
            make: data.make,
            model: data.model,
            year: parseInt(data.year),
            price: parseInt(data.price),
            mileage: parseInt(data.mileage),
            vin: data.vin,
            condition: data.mileage ? (parseInt(data.mileage) < 30000 ? "Certified Pre-Owned" : "Used") : "Used",
            bodyType: "Sedan", // Default for now or add to form
            fuelType: "Gasoline",
            transmission: "Automatic",
            exteriorColor: "Black", // Default
            interiorColor: "Black", // Default
            image: preview || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2FyfGVufDB8fDB8fHww",
            features: [],
            carfaxUrl: "#"
        };

        addVehicle(newVehicle); // Update global state

        setLoading(false);
        setSuccess(true);

        // Reset after success
        setTimeout(() => {
            setSuccess(false);
            form.reset();
            setPreview(null);
        }, 3000);
    };

    return (
        <div className="bg-card rounded-xl border shadow-sm p-6 max-w-2xl">
            <div className="mb-6">
                <h2 className="text-xl font-semibold">Add New Vehicle</h2>
                <p className="text-sm text-muted-foreground">Enter the details of the new vehicle to add to inventory.</p>
            </div>

            {success ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-green-600 animate-in fade-in">
                    <CheckCircle2 className="h-16 w-16 mb-4" />
                    <h3 className="text-2xl font-bold">Success!</h3>
                    <p className="text-muted-foreground">Vehicle has been added to the inventory system.</p>
                </div>
            ) : (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="make"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Make</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Ford" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="model"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Model</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. F-150 Lariat" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="year"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Year</FormLabel>
                                        <FormControl>
                                            <Input placeholder="2024" type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Available">Available</SelectItem>
                                                <SelectItem value="Reserved">Reserved</SelectItem>
                                                <SelectItem value="Sold">Sold</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price ($)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="45000" type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="mileage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mileage</FormLabel>
                                        <FormControl>
                                            <Input placeholder="25000" type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="vin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>VIN</FormLabel>
                                    <FormControl>
                                        <Input placeholder="1FTEW1E50KFA..." {...field} className="font-mono uppercase" maxLength={17} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-2">
                            <FormLabel>Vehicle Image</FormLabel>
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="cursor-pointer"
                                    />
                                </div>
                                {preview && (
                                    <div className="h-16 w-24 shrink-0 overflow-hidden rounded-md border">
                                        <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                                    </div>
                                )}
                            </div>
                            <FormDescription>Upload a high-quality main image for the vehicle.</FormDescription>
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding Vehicle...
                                    </>
                                ) : (
                                    <>
                                        <PlusCircle className="mr-2 h-4 w-4" /> Add Vehicle
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
}

import { PlusCircle } from "lucide-react";
