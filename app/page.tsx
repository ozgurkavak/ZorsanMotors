"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useVehicles } from "@/lib/vehicle-context";
import { CarCard } from "@/components/inventory/CarCard";
import { ArrowRight } from "lucide-react";
import { HeroSlider } from "@/components/home/HeroSlider";
import { VideoSection } from "@/components/home/VideoSection";

export default function Home() {
  const { vehicles } = useVehicles();
  const featuredCars = vehicles.filter(v =>
    (v.status || "").toLowerCase() !== 'sold' &&
    (v.status || "").toLowerCase() !== 'hidden'
  ).slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Featured Inventory */}
      <section className="py-12 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight select-none">Latest Arrivals</h2>
              <p className="text-muted-foreground mt-2">Fresh on the lot. Don't miss out.</p>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex">
              <Link href="/inventory">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCars.map((car) => (
              <CarCard key={car.id} vehicle={car} />
            ))}
          </div>
          <div className="mt-8 md:hidden">
            <Button variant="ghost" asChild className="w-full">
              <Link href="/inventory">View All Inventory</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Video / Why Choose Us Section */}
      <VideoSection />
    </div>
  );
}
