import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
    return (
        <div className="container max-w-7xl mx-auto py-12 md:py-24">
            <div className="flex flex-col gap-8 md:gap-16">
                {/* Our Story Section */}
                <section className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
                    <Badge variant="outline" className="text-primary border-primary">Since 1995</Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Our Story</h1>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        What started as a small family lot has grown into one of the region's most trusted dealerships.
                        At Zorsan Motors, we believe buying a car should be exciting, transparent, and fair.
                        We have helped thousands of families find their perfect vehicle.
                        We believe that buying a used car should be an exciting and
                        stress-free experience, which is why we meticulously inspect every vehicle and offer tailored financing
                        solutions for every credit history.
                    </p>
                </section>
            </div>
        </div>
    );
}


