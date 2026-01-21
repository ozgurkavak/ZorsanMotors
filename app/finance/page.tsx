import { FinancingForm } from "@/components/forms/FinancingForm";

export default function FinancePage() {
    return (
        <div className="container py-12">
            <div className="mx-auto max-w-2xl text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Get Pre-Qualified in Minutes
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Apply for financing securely online. No impact to your credit score to check rates.
                </p>
            </div>
            <FinancingForm />
        </div>
    );
}
