import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
                        What started as a small family lot has grown into one of New England's most trusted dealerships.
                        At ZorsanMotors, we believe buying a car should be exciting, transparent, and fair.community service, we have helped thousands of
                        families find their perfect vehicle. We believe that buying a used car should be an exciting and
                        stress-free experience, which is why we meticulously inspect every vehicle and offer tailored financing
                        solutions for every credit history.
                    </p>
                </section>

                {/* Meet the Team Section */}
                <section>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tight">Meet the Team</h2>
                        <p className="text-muted-foreground mt-2">The people dedicated to getting you on the road.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <TeamCard
                            name="John Doe"
                            role="Visionary & Founder"
                            bio="John started ZorsanMotors with a single tow truck and a dream. His passion for cars and people has built this dealership into what it is today."
                            image="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=400"
                        />
                        <TeamCard
                            name="Jane Smith"
                            role="Sales Manager"
                            bio="Jane brings 15 years of customer service excellence. She ensures every customer feels heard, respected, and valued throughout the process."
                            image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400"
                        />
                        <TeamCard
                            name="Mike Ross"
                            role="Finance Manager"
                            bio="A wizard with numbers, Mike specializes in securing the best possible rates for our customers, regardless of their credit history."
                            image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=400"
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}

function TeamCard({ name, role, bio, image }: { name: string, role: string, bio: string, image: string }) {
    return (
        <Card className="text-center overflow-hidden border-border/50 hover:border-primary/50 transition-colors">
            <div className="relative h-48 w-full bg-muted">
                <div className="absolute inset-x-0 -bottom-12 flex justify-center">
                    <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                        <AvatarImage src={image} alt={name} className="object-cover" />
                        <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                </div>
            </div>
            <CardHeader className="pt-16 pb-2">
                <CardTitle className="text-xl">{name}</CardTitle>
                <CardDescription className="text-primary font-medium">{role}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-sm">{bio}</p>
            </CardContent>
        </Card>
    );
}
