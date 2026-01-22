import Link from "next/link";
import { Button } from "@/components/ui/button";


export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center space-x-2">
                    <img src="/logo.png" alt="Zorsan Motors Logo" className="h-10 w-10 object-contain" />
                    <span className="text-xl font-bold tracking-tight">Zorsan <span className="text-primary">Motors</span></span>
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
                    <Button size="sm" asChild>
                        <Link href="/inventory">Browse Cars</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
