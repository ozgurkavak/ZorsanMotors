"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Loader2, PlusCircle, CheckCircle2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useVehicles } from "@/lib/vehicle-context";
import { Vehicle } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const vehicleSchema = z.object({
    make: z.string().min(2, "Make is required"),
    model: z.string().min(2, "Model is required"),
    year: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 1900, "Valid year required"),
    price: z.string().min(1, "Price is required"),
    vin: z.string().min(17, "VIN must be 17 characters").max(17),
    mileage: z.string().min(1, "Mileage is required"),
    status: z.enum(["Available", "Sold", "Reserved"]),
    bodyType: z.enum(["Sedan", "Hatchback", "Wagon", "SUV", "Truck", "Coupe", "Minivan", "Van"]),
    transmission: z.enum(["Automatic", "Manual", "CVT", "DCT"]),
    features: z.array(z.string()).optional(),
    images: z.any()
        .refine((files) => files?.length > 0, "At least one image is required.")
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

const featuresList = [
    "Bluetooth", "Backup Camera", "Heated Seats", "Navigation",
    "Apple CarPlay", "Android Auto", "Lane Assist", "Blind Spot Monitor",
    "Sunroof", "Leather Seats", "Third Row Seating", "Keyless Entry",
    "Remote Start", "Premium Sound", "Adaptive Cruise Control"
];

export function AddVehicleForm() {
    const { addVehicle } = useVehicles();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [previews, setPreviews] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newFiles = Array.from(files);

            // Generate previews
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
            setSelectedFiles(prev => [...prev, ...newFiles]);

            // Update form
            form.setValue("images", [...selectedFiles, ...newFiles], { shouldValidate: true });
        }
    };

    const removeImage = (index: number) => {
        const newPreviews = [...previews];
        URL.revokeObjectURL(newPreviews[index]); // Cleanup
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);

        const newFiles = [...selectedFiles];
        newFiles.splice(index, 1);
        setSelectedFiles(newFiles);
        form.setValue("images", newFiles, { shouldValidate: true });
    };

    const onSubmit = async (data: VehicleFormValues) => {
        setLoading(true);

        try {
            const imageUrls: string[] = [];

            // Upload all images
            for (const file of selectedFiles) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('vehicle-images')
                    .upload(fileName, file);

                if (uploadError) throw new Error("Image upload failed: " + uploadError.message);

                const { data: publicUrlData } = supabase.storage
                    .from('vehicle-images')
                    .getPublicUrl(fileName);

                imageUrls.push(publicUrlData.publicUrl);
            }

            // Create new vehicle object
            const newVehicle: Vehicle = {
                id: "temp-id",
                make: data.make,
                model: data.model,
                year: parseInt(data.year),
                price: parseInt(data.price),
                mileage: parseInt(data.mileage),
                vin: data.vin,
                condition: parseInt(data.mileage) < 30000 ? "Certified Pre-Owned" : "Used",
                bodyType: data.bodyType,
                fuelType: "Gasoline", // Could add select for this too later
                transmission: data.transmission,
                exteriorColor: "Black",
                interiorColor: "Black",
                image: imageUrls.length > 0 ? imageUrls[0] : "", // Primary
                images: imageUrls, // All images
                features: data.features || [],
                carfaxUrl: "#",
                status: data.status
            };

            await addVehicle(newVehicle);

            setSuccess(true);

            // Cleanup and Reset
            previews.forEach(url => URL.revokeObjectURL(url));
            setTimeout(() => {
                setSuccess(false);
                form.reset();
                setPreviews([]);
                setSelectedFiles([]);
            }, 3000);

        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to add vehicle. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
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

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                        <Input placeholder="1FTEW1E50KFA..." {...field} className="font-mono uppercase" maxLength={17} />
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
                                    {previews.map((url, index) => (
                                        <div key={index} className="relative aspect-video rounded-md overflow-hidden border">
                                            <img src={url} alt={`Preview ${index}`} className="h-full w-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <FormDescription>Upload one or more images. The first image will be the primary cover.</FormDescription>
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
        </>
    );
}
