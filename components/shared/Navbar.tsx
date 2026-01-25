import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import { LayoutDashboard, Car } from "lucide-react";

export async function Navbar() {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_session")?.value === "true";

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center space-x-2 select-none outline-none">
                    <Car className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold tracking-tight">ZorSan <span className="text-primary">Motors</span></span>
                </Link>
                <nav className="hidden md:flex gap-6 text-sm font-medium">
                    <Link href="/inventory" className="transition-colors hover:text-primary">
                        Inventory
                    </Link>
                    <Link href="/finance" className="transition-colors hover:text-primary">
                        Financing
                    </Link>
                    <Link href="/about" className="transition-colors hover:text-primary">
                        About Us
                    </Link>
                    <Link href="/contact" className="transition-colors hover:text-primary">
                        Contact
                    </Link>
                </nav>
                <div className="flex items-center gap-4">
                    {isAdmin && (
                        <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground hidden sm:flex" asChild>
                            <Link href="/zm-console">
                                <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                            </Link>
                        </Button>
                    )}
                    <Button size="sm" asChild>
                        <Link href="/inventory">Browse Cars</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
