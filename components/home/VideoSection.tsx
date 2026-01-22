"use client";

import { CheckCircle2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VideoSection() {
    return (
        <section className="relative overflow-hidden py-24 bg-muted/20">
            <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                Why Choose Zorsan Motors?
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground w-11/12">
                                We're not just selling cars; we're building relationships.
                                Experience a transparent, reliable buying process designed around you.
                                <span className="block mt-2 font-semibold text-primary">Affordable and reliable.</span>
                            </p>
                        </div>

                        <div className="grid gap-6">
                            {[
                                { title: "Multipoint Inspection", desc: "Every vehicle is rigorously tested for safety and performance." },
                                { title: "Transparent Pricing", desc: "No hidden fees, no surprises. The price you see is what you pay." },
                                { title: "7-Day Money Back", desc: "Love it or return it within 7 days. Your satisfaction is guaranteed." },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <CheckCircle2 className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                                        <p className="text-muted-foreground">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative aspect-square md:aspect-video overflow-hidden rounded-2xl border shadow-xl">
                        <img
                            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1200&auto=format&fit=crop"
                            alt="Happy car owner"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
