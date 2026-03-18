"use client";

import { useState } from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, LayoutDashboard } from "lucide-react";

interface MobileMenuProps {
    isAdmin: boolean;
}

export function MobileMenu({ isAdmin }: MobileMenuProps) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden ml-2 h-9 w-9 px-0">
                    <span className="sr-only">Toggle Menu</span>
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] flex flex-col gap-8 pt-12">
                <Link href="/" onClick={() => setOpen(false)} className="flex items-center space-x-2 select-none outline-none">
                    <img src="/logo4.png" alt="ZorSan Motors Logo" className="h-8 w-8 object-contain" />
                    <span className="text-xl font-bold tracking-tight">ZorSan <span className="text-primary">Motors</span></span>
                </Link>
                
                <nav className="flex flex-col gap-6 text-lg font-medium">
                    <Link href="/inventory" onClick={() => setOpen(false)} className="transition-colors hover:text-primary">Inventory</Link>
                    <Link href="/finance" onClick={() => setOpen(false)} className="transition-colors hover:text-primary">Financing</Link>
                    <Link href="/about" onClick={() => setOpen(false)} className="transition-colors hover:text-primary">About Us</Link>
                    <Link href="/contact" onClick={() => setOpen(false)} className="transition-colors hover:text-primary">Contact</Link>
                </nav>

                {isAdmin && (
                    <Button variant="outline" className="justify-start border-primary text-primary mt-auto" onClick={() => setOpen(false)} asChild>
                        <Link href="/zm-console">
                            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                        </Link>
                    </Button>
                )}
            </SheetContent>
        </Sheet>
    );
}
