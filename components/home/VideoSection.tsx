"use client";

import { CheckCircle2 } from "lucide-react";

export function VideoSection() {
    return (
        <section className="relative overflow-hidden py-24 bg-muted/20">
            <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center space-y-12">
                    <div className="max-w-3xl">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Why Choose Zorsan Motors?
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            We're not just selling cars; we're building relationships.
                            Experience a transparent, reliable buying process designed around you.
                            <span className="block mt-2 font-semibold text-primary">Affordable and reliable.</span>
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3 text-left">
                        {[
                            { title: "Multipoint Inspection", desc: "Every vehicle is rigorously tested for safety and performance." },
                            { title: "Transparent Pricing", desc: "No hidden fees, no surprises. The price you see is what you pay." },
                            { title: "7-Day Money Back", desc: "Love it or return it within 7 days. Your satisfaction is guaranteed." },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border shadow-sm">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold text-xl text-foreground mb-2">{item.title}</h3>
                                <p className="text-muted-foreground">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
