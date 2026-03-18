import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Financing | ZorSan Motors",
    description: "Get pre-approved for your next vehicle at ZorSan Motors. Quick, easy, and secure auto financing.",
};

export default function FinancePage() {
    const applicationUrl = "https://www.startyourcreditapproval.com/credit-application/DC716?utm_medium=qr_code&utm_source=dealer&utm_campaign=credit_app";

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-muted/30 py-20 lg:py-32 overflow-hidden border-b">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                    <div className="text-center max-w-3xl mx-auto space-y-6">
                        <Badge className="bg-primary/10 text-primary border-primary/20 mb-4" variant="outline">
                            Fast & Secure
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                            Drive Your Dream Car Today
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Please complete your secure credit application through our trusted financing partner below. It's fast, simple, and you'll get a decision in minutes.
                        </p>
                        
                        <div className="pt-8 fade-in">
                            <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 shadow-lg transition-transform hover:-translate-y-1" asChild>
                                <a href={applicationUrl} target="_blank" rel="noopener noreferrer">
                                    Start Your Credit Application <ArrowRight className="ml-2 h-5 w-5" />
                                </a>
                            </Button>
                            <p className="mt-4 text-sm text-muted-foreground flex items-center justify-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-green-500" /> Safe, 256-bit encrypted data processing.
                            </p>
                        </div>
                    </div>
                </div>
                {/* Background decorative elements */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
            </section>

        </div>
    );
}
