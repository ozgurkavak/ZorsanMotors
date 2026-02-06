"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
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
import { Loader2, X } from "lucide-react";
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
    bodyType: z.enum(["Sedan", "Hatchback", "Wagon", "SUV", "Truck", "Coupe", "Minivan", "Van"]).optional(),
    transmission: z.enum(["Automatic", "Manual", "CVT", "DCT"]).optional(),
    features: z.array(z.string()).optional(),
    images: z.any().optional(),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

const featuresList = [
    "Bluetooth", "Backup Camera", "Heated Seats", "Navigation",
    "Apple CarPlay", "Android Auto", "Lane Assist", "Blind Spot Monitor",
    "Sunroof", "Leather Seats", "Third Row Seating", "Keyless Entry",
    "Remote Start", "Premium Sound", "Adaptive Cruise Control"
];

interface EditVehicleDialogProps {
    vehicle: Vehicle | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EditVehicleDialog({ vehicle, open, onOpenChange }: EditVehicleDialogProps) {
    const { updateVehicle } = useVehicles();
    const [loading, setLoading] = useState(false);

    // Image State
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [newPreviews, setNewPreviews] = useState<string[]>([]);

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
            bodyType: "Sedan",
            transmission: "Automatic",
            features: [],
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
                bodyType: vehicle.bodyType as any,
                transmission: vehicle.transmission as any || "Automatic",
                features: vehicle.features || [],
            });

            // Initialize images
            setExistingImages(vehicle.images || (vehicle.image ? [vehicle.image] : []));
            setNewFiles([]);
            setNewPreviews([]);
        }
    }, [vehicle, open, form]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const addedFiles = Array.from(files);
            const addedPreviews = addedFiles.map(file => URL.createObjectURL(file));

            setNewFiles(prev => [...prev, ...addedFiles]);
            setNewPreviews(prev => [...prev, ...addedPreviews]);
        }
    };

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeNewImage = (index: number) => {
        const previewUrl = newPreviews[index];
        URL.revokeObjectURL(previewUrl);

        setNewPreviews(prev => prev.filter((_, i) => i !== index));
        setNewFiles(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: VehicleFormValues) => {
        if (!vehicle) return;
        setLoading(true);

        try {
            const uploadedUrls: string[] = [];

            // Upload new images
            for (const file of newFiles) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('vehicle-images')
                    .upload(fileName, file);

                if (uploadError) throw new Error("Image upload failed: " + uploadError.message);

                const { data: publicUrlData } = supabase.storage
                    .from('vehicle-images')
                    .getPublicUrl(fileName);

                uploadedUrls.push(publicUrlData.publicUrl);
            }

            // Combine existing (remaining) and new images
            const finalImages = [...existingImages, ...uploadedUrls];
            const primaryImage = finalImages.length > 0 ? finalImages[0] : "";

            const updates: Partial<Vehicle> = {
                make: data.make,
                model: data.model,
                year: parseInt(data.year),
                price: parseInt(data.price),
                mileage: parseInt(data.mileage),
                vin: data.vin,
                status: data.status,
                bodyType: data.bodyType,
                transmission: data.transmission as any,
                features: data.features || [],
                image: primaryImage,
                images: finalImages,
                condition: parseInt(data.mileage) < 30000 ? "Certified Pre-Owned" : "Used",
            };

            await updateVehicle(vehicle.id, updates);

            // Cleanup previews
            newPreviews.forEach(url => URL.revokeObjectURL(url));

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

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                name="bodyType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Body Style</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Body Style" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {["Sedan", "Hatchback", "Wagon", "SUV", "Truck", "Coupe", "Minivan", "Van"].map((type) => (
                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="transmission"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Transmission</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {["Automatic", "Manual", "CVT", "DCT"].map((t) => (
                                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                        <FormField
                            control={form.control}
                            name="vin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>VIN</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="font-mono uppercase" maxLength={17} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-3">
                            <FormLabel>Vehicle Features</FormLabel>
                            <FormField
                                control={form.control}
                                name="features"
                                render={() => (
                                    <FormItem>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                            {featuresList.map((feature) => (
                                                <FormField
                                                    key={feature}
                                                    control={form.control}
                                                    name="features"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem
                                                                key={feature}
                                                                className="flex flex-row items-center space-x-2 space-y-0 p-2 rounded-md border bg-muted/20"
                                                            >
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(feature)}
                                                                        onCheckedChange={(checked) => {
                                                                            return checked
                                                                                ? field.onChange([...(field.value || []), feature])
                                                                                : field.onChange(
                                                                                    field.value?.filter(
                                                                                        (value) => value !== feature
                                                                                    )
                                                                                )
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="text-xs font-normal cursor-pointer flex-1">
                                                                    {feature}
                                                                </FormLabel>
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <FormLabel>Vehicle Images</FormLabel>
                            <div className="flex flex-col gap-4">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="cursor-pointer"
                                />
                                <div className="grid grid-cols-4 gap-4">
                                    {/* Existing Images */}
                                    {existingImages.map((url, index) => (
                                        <div key={`existing-${index}`} className="relative aspect-video rounded-md overflow-hidden border">
                                            <img src={url} alt={`Existing ${index}`} className="h-full w-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeExistingImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                                                title="Remove Image"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}

                                    {/* New Previews */}
                                    {newPreviews.map((url, index) => (
                                        <div key={`new-${index}`} className="relative aspect-video rounded-md overflow-hidden border border-primary/50">
                                            <img src={url} alt={`Preview ${index}`} className="h-full w-full object-cover" />
                                            <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
                                            <button
                                                type="button"
                                                onClick={() => removeNewImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                                                title="Remove Upload"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <FormDescription>Manage vehicle images. Add new ones or remove existing ones.</FormDescription>
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
