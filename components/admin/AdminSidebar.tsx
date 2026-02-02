"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/actions/auth";
import {
    LayoutDashboard,
    Car,
    Settings,
    LogOut,
    PlusCircle,
    Activity,
    DollarSign
} from "lucide-react";

const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, href: "/zm-console" },
    { title: "Inventory", icon: Car, href: "/zm-console/inventory" },
    { title: "Financials", icon: DollarSign, href: "/zm-console/finance" },
    { title: "Sync Logs", icon: Activity, href: "/zm-console/logs" },
    { title: "Settings", icon: Settings, href: "/zm-console/settings" },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await logoutAction();
        window.location.href = "/";
    };

    return (
        <div className="flex w-64 flex-col border-r bg-card min-h-screen">
            <div className="flex h-16 items-center border-b px-6">
                <span className="text-lg font-bold tracking-tight">Zorsan <span className="text-primary">Motors</span> Admin</span>
            </div>
            <div className="flex-1 py-6 px-3 space-y-1">
                {menuItems.map((item) => (
                    <Link
                        key={item.title}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                            pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                    </Link>
                ))}
            </div>
            <div className="border-t p-4">
                <div onClick={handleLogout} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 cursor-pointer">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                </div>
            </div>
        </div>
    );
}
