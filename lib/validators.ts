import { z } from "zod";

export const vehicleInfoSchema = z.object({
    vehicleId: z.string().optional(),
    stockNumber: z.string().optional(), // Or VIN
    estimatedPrice: z.number().min(0, "Price must be positive").optional(),
});

export const personalInfoSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().length(2, "State must be 2 characters (e.g. CA)"),
    zipCode: z.string().min(5, "Zip code must be at least 5 digits"),
});

export const creditScoreSchema = z.object({
    creditScoreRange: z.enum([
        "Excellent (720+)",
        "Good (690-719)",
        "Fair (630-689)",
        "Poor (<630)",
    ]),
    employmentStatus: z.enum(["Employed", "Self-Employed", "Retired", "Other"]),
    annualIncome: z.coerce.number().min(1000, "Annual income is required"),
    monthlyHousingPayment: z.coerce.number().min(0, "Housing payment is required"),
    downPayment: z.coerce.number().min(0, "Down payment must be positive"),
});

export const financingFormSchema = vehicleInfoSchema
    .merge(personalInfoSchema)
    .merge(creditScoreSchema);

export type FinancingFormData = z.infer<typeof financingFormSchema>;
