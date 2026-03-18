import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Clock, CheckCircle2, ArrowRight } from "lucide-react";

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
                            We believe everyone deserves a great car. With our seamless, secure, and rapid credit approval process, getting behind the wheel has never been easier. All credit types are welcome!
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

            {/* Benefits Section */}
            <section className="py-20 bg-background">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight">Why Finance With Us?</h2>
                        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                            We partner with top lenders to provide you with the most competitive rates and terms available in the market.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Benefit 1 */}
                        <div className="group p-8 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
                                <Clock className="w-32 h-32" />
                            </div>
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                                <Clock className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Lightning Fast Approval</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Don't wait for days. Fill out our simple online form and get a credit decision within minutes, ensuring a smooth and rapid purchasing process.
                            </p>
                        </div>

                        {/* Benefit 2 */}
                        <div className="group p-8 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
                                <ShieldCheck className="w-32 h-32" />
                            </div>
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                                <ShieldCheck className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">All Credit Types</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Good credit, bad credit, or no credit at all. We have established relationships with multiple financial institutions to find a plan that works for you.
                            </p>
                        </div>

                        {/* Benefit 3 */}
                        <div className="group p-8 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
                                <CheckCircle2 className="w-32 h-32" />
                            </div>
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                                <CheckCircle2 className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Flexible Terms</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                We work hard to secure aggressive financing terms for you. Pick the monthly payment schedule that best comfortably fits your budget and lifestyle.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
