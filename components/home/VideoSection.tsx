"use client";

import { CheckCircle2 } from "lucide-react";

export function VideoSection() {
    return (
        <section className="relative overflow-hidden py-24 bg-muted/20">
            <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center space-y-12">
                    <div className="max-w-3xl">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Why Choose ZorSan Motors?
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            At ZorSan Motors, we believe buying a car should be exciting, transparent, and fair.
                            Buying a used car should be a stress-free experience,
                            which is why we focused on buying and selling widely approved reliable vehicles rather than the most profitable ones.
                            <span className="block mt-4 font-semibold text-primary text-2xl">
                                No hidden fees, no surprises. The price you see is what you pay.
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
