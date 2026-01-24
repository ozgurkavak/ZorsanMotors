import { FinancingForm } from "@/components/forms/FinancingForm";

export default function FinancePage() {
    return (
        <div className="container py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Financing</h1>
            <div className="p-12 rounded-2xl bg-muted/30 border-dashed border-2">
                <p className="text-2xl font-semibold text-muted-foreground">Coming Soon</p>
                <p className="mt-2 text-muted-foreground">We are working on setting up our secure financing portal.</p>
            </div>
        </div>
    );
}
