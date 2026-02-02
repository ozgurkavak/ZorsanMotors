"use client";

import { FinanceTable } from "@/components/admin/FinanceTable";
import { FinanceStats } from "@/components/admin/FinanceStats";
import { Suspense } from "react";

export default function FinancePage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Financials & Expenses</h1>
                    <p className="text-muted-foreground">Track purchase costs, expenses, and profitability.</p>
                </div>
            </div>

            <FinanceStats />

            <div className="grid gap-8">
                <div className="w-full">
                    <Suspense fallback={<div>Loading financials...</div>}>
                        <FinanceTable />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
