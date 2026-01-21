"use client";

import { useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { financingFormSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

type FormData = z.infer<typeof financingFormSchema>;

const STEPS = [
    { id: 1, name: "Vehicle Info", fields: ["stockNumber", "estimatedPrice"] },
    { id: 2, name: "Personal Info", fields: ["firstName", "lastName", "email", "phone", "address", "city", "state", "zipCode"] },
    { id: 3, name: "Financial Info", fields: ["employmentStatus", "annualIncome", "monthlyHousingPayment", "downPayment", "creditScoreRange"] },
];

export function FinancingForm() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(financingFormSchema) as any,
        defaultValues: {
            vehicleId: "",
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            stockNumber: "",
            estimatedPrice: 0,
            annualIncome: 0,
            monthlyHousingPayment: 0,
            downPayment: 0,
            employmentStatus: undefined,
            creditScoreRange: undefined,
        },
        mode: "onChange",
    });

    const { trigger, handleSubmit } = form;

    const nextStep = async () => {
        const fields = STEPS[step - 1].fields as FieldPath<FormData>[];
        const isValid = await trigger(fields, { shouldFocus: true });
        if (isValid) {
            setStep((prev) => prev + 1);
        }
    };

    const prevStep = () => {
        setStep((prev) => prev - 1);
    };

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log(data);
        setIsSubmitting(false);
        setIsSuccess(true);
    };

    if (isSuccess) {
        return (
            <Card className="w-full max-w-2xl mx-auto text-center p-8">
                <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="h-8 w-8 text-green-600" />
                    </div>
                </div>
                <CardTitle className="text-2xl mb-2">Application Received!</CardTitle>
                <CardDescription>
                    Your financing application has been successfully submitted. One of our finance managers will contact you shortly.
                </CardDescription>
                <Button className="mt-6" onClick={() => window.location.href = '/'}>
                    Back to Home
                </Button>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Apply for Financing</CardTitle>
                <CardDescription>
                    Step {step} of 3: {STEPS[step - 1].name}
                </CardDescription>
                <div className="h-2 w-full bg-secondary rounded-full mt-2 overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-300 ease-in-out"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {step === 1 && (
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormField<FormData>
                                            control={form.control as any}
                                            name="stockNumber"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Stock Number (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. 12345" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField<FormData>
                                            control={form.control as any}
                                            name="estimatedPrice"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Estimated Price ($)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormField<FormData>
                                            control={form.control as any}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>First Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="John" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField<FormData>
                                            control={form.control as any}
                                            name="lastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Last Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Doe" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField<FormData>
                                            control={form.control as any}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem className="col-span-2">
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="john@example.com" type="email" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField<FormData>
                                            control={form.control as any}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Phone</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="(555) 123-4567" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField<FormData>
                                            control={form.control as any}
                                            name="address"
                                            render={({ field }) => (
                                                <FormItem className="col-span-2">
                                                    <FormLabel>Address</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="123 Main St" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="grid grid-cols-3 gap-4 col-span-2">
                                            <FormField<FormData>
                                                control={form.control as any}
                                                name="city"
                                                render={({ field }) => (
                                                    <FormItem className="col-span-1">
                                                        <FormLabel>City</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField<FormData>
                                                control={form.control as any}
                                                name="state"
                                                render={({ field }) => (
                                                    <FormItem className="col-span-1">
                                                        <FormLabel>State</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="CA" maxLength={2} {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField<FormData>
                                                control={form.control as any}
                                                name="zipCode"
                                                render={({ field }) => (
                                                    <FormItem className="col-span-1">
                                                        <FormLabel>Zip</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormField<FormData>
                                            control={form.control as any}
                                            name="employmentStatus"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Employment Status</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select..." />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Employed">Employed</SelectItem>
                                                            <SelectItem value="Self-Employed">Self-Employed</SelectItem>
                                                            <SelectItem value="Retired">Retired</SelectItem>
                                                            <SelectItem value="Other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField<FormData>
                                            control={form.control as any}
                                            name="annualIncome"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Annual Income ($)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField<FormData>
                                            control={form.control as any}
                                            name="monthlyHousingPayment"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Monthly Housing ($)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField<FormData>
                                            control={form.control as any}
                                            name="downPayment"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Down Payment ($)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField<FormData>
                                            control={form.control as any}
                                            name="creditScoreRange"
                                            render={({ field }) => (
                                                <FormItem className="col-span-2">
                                                    <FormLabel>Self-Assessed Credit Score</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select range..." />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Excellent (720+)">Excellent (720+)</SelectItem>
                                                            <SelectItem value="Good (690-719)">Good (690-719)</SelectItem>
                                                            <SelectItem value="Fair (630-689)">Fair (630-689)</SelectItem>
                                                            <SelectItem value="Poor (<630)">Poor (&lt;630)</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        <div className="flex justify-between mt-6">
                            {step > 1 && (
                                <Button type="button" variant="outline" onClick={prevStep}>
                                    Previous
                                </Button>
                            )}
                            {step < 3 ? (
                                <Button type="button" onClick={nextStep} className="ml-auto">
                                    Next Step
                                </Button>
                            ) : (
                                <Button type="submit" disabled={isSubmitting} className="ml-auto">
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Submit Application
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
