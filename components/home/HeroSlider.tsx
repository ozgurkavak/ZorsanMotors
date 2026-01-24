"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const slides = [
    {
        id: 1,
        image: "/hero-slides/slide1.jpg",
        title: "Quality Cars Trusted Deals",
        subtitle: "Multipoint inspected, transparently priced, and ready for you.",
        cta: "See Specials",
        link: "/inventory"
    },
    {
        id: 2,
        image: "/hero-slides/slide2.jpg",
        title: "Adventure Awaits",
        subtitle: "Find the perfect SUV for your next journey. Reliable, spacious, and capable.",
        cta: "Explore SUVs",
        link: "/inventory?bodyType=SUV"
    },
    {
        id: 3,
        image: "/hero-slides/slide3.jpg",
        title: "Shopping From ZorSan = Peace Of Mind",
        subtitle: "Experience a stress-free buying process with our curated selection of reliable vehicles.",
        cta: "Meet Our Team",
        link: "/about"
    }
];

export function HeroSlider() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative h-[600px] w-full overflow-hidden bg-black">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 0.6, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={slides[current].image}
                        alt="Hero background"
                        fill
                        className="object-cover"
                        priority
                        quality={90}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 z-10 flex items-center justify-center text-center">
                <div className="container max-w-4xl px-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl">
                                {slides[current].title}
                            </h1>
                            <p className="mt-6 text-lg text-gray-200 sm:text-xl md:text-2xl">
                                {slides[current].subtitle}
                            </p>
                            <div className="mt-8 flex justify-center gap-4">
                                <Button size="lg" className="h-12 px-8 text-lg bg-primary hover:bg-primary/90" asChild>
                                    <Link href={slides[current].link}>
                                        {slides[current].cta} <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`h-2 rounded-full transition-all ${index === current ? "w-8 bg-primary" : "w-2 bg-white/50 hover:bg-white"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
