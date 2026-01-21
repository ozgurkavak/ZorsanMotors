"use client";

import { CheckCircle2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VideoSection() {
    return (
        <section className="relative overflow-hidden py-24">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="h-full w-full object-cover opacity-30 invert dark:invert-0"
                    poster="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200"
                >
                    <source src="https://videos.pexels.com/video-files/4488796/4488796-hd_1920_1080_25fps.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
            </div>

            <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                                Why Choose Zorsan Motors?
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground w-11/12">
                                We're not just selling cars; we're upgrading your lifestyle.
                                Experience a transparent, premium buying process designed around you.
                            </p>
                        </div>

                        <div className="grid gap-6">
                            {[
                                { title: "150-Point Inspection", desc: "Every vehicle is rigorously tested for safety and performance." },
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

                        <Button size="lg" className="mt-4">
                            <Play className="mr-2 h-4 w-4" /> Watch Our Story
                        </Button>
                    </div>

                    <div className="relative aspect-video overflow-hidden rounded-2xl border bg-black/50 shadow-2xl transition-transform hover:scale-[1.02]">
                        {/* Foreground "Player" Mockup */}
                        <video
                            controls
                            className="h-full w-full object-cover"
                            poster="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200"
                        >
                            <source src="https://videos.pexels.com/video-files/8059882/8059882-hd_1920_1080_25fps.mp4" type="video/mp4" />
                        </video>
                    </div>
                </div>
            </div>
        </section>
    );
}
