"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Vehicle } from "@/types";
import { useVehicles } from "@/lib/vehicle-context";
import { supabase } from "@/lib/supabase";

const vehicleSchema = z.object({
    make: z.string().min(2, "Make is required"),
    model: z.string().min(2, "Model is required"),
    year: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 1900, "Valid year required"),
    price: z.string().min(1, "Price is required"),
    vin: z.string().min(17, "VIN must be 17 characters").max(17),
    mileage: z.string().min(1, "Mileage is required"),
    status: z.enum(["Available", "Sold", "Reserved"]),
    image: z.any().optional(),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

interface EditVehicleDialogProps {
    vehicle: Vehicle | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditVehicleDialog({ vehicle, open, onOpenChange }: EditVehicleDialogProps) {
    const { updateVehicle } = useVehicles();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const form = useForm<VehicleFormValues>({
        resolver: zodResolver(vehicleSchema),
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

    useEffect(() => {
        if (vehicle && open) {
            form.reset({
                make: vehicle.make,
                model: vehicle.model,
                year: vehicle.year.toString(),
                price: vehicle.price.toString(),
                vin: vehicle.vin,
                mileage: vehicle.mileage.toString(),
                status: (vehicle.status as "Available" | "Sold" | "Reserved") || "Available",
            });
            setPreview(vehicle.image);
        }
    }, [vehicle, open, form]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
            form.setValue("image", file, { shouldValidate: true });
        }
    };

    const onSubmit = async (data: VehicleFormValues) => {
        if (!vehicle) return;
        setLoading(true);

        try {
            let imageUrl = vehicle.image;

            // Handle Image Upload if changed
            if (data.image instanceof File) {
                const imageFile = data.image;
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('vehicle-images')
                    .upload(fileName, imageFile);

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage
                    .from('vehicle-images')
                    .getPublicUrl(fileName);

                imageUrl = publicUrlData.publicUrl;
            }

            const updates: Partial<Vehicle> = {
                make: data.make,
                model: data.model,
                year: parseInt(data.year),
                price: parseInt(data.price),
                mileage: parseInt(data.mileage),
                vin: data.vin,
                status: data.status,
                image: imageUrl,
                condition: parseInt(data.mileage) < 30000 ? "Certified Pre-Owned" : "Used",
            };

            await updateVehicle(vehicle.id, updates);
            onOpenChange(false);
        } catch (error) {
            console.error("Update error:", error);
            alert("Failed to update vehicle.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Vehicle</DialogTitle>
                    <DialogDescription>
                        Update vehicle details. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="make"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Make</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
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
                                        <FormControl><Input {...field} /></FormControl>
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
                                        <FormControl><Input type="number" {...field} /></FormControl>
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
                                        <FormControl><Input type="number" {...field} /></FormControl>
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
                                        <FormControl><Input type="number" {...field} /></FormControl>
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
                                    <FormControl><Input {...field} className="font-mono uppercase" maxLength={17} /></FormControl>
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
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
