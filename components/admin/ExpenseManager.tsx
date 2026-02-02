"use client";

import { useState } from "react";
import { Vehicle } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useVehicles } from "@/lib/vehicle-context";
import { Trash2, Plus, Receipt } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface ExpenseManagerProps {
    vehicle: Vehicle;
    compact?: boolean;
}

export function ExpenseManager({ vehicle, compact = false }: ExpenseManagerProps) {
    const { refreshVehicles } = useVehicles();
    const [loading, setLoading] = useState(false);

    // New Expense State
    const [type, setType] = useState("Parts");
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const expenses = vehicle.expenses || [];
    const totalExpenses = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    const handleAddExpense = async () => {
        if (!amount || !type) return;
        setLoading(true);

        try {
            const { error } = await supabase.from('expenses').insert({
                vehicle_id: vehicle.id,
                expense_type: type,
                amount: parseFloat(amount),
                description: description,
                date: new Date().toISOString()
            });

            if (error) throw error;

            // Reset form
            setAmount("");
            setDescription("");
            await refreshVehicles();
        } catch (e) {
            console.error(e);
            alert("Failed to add expense");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteExpense = async (id: string) => {
        if (!confirm("Delete this expense?")) return;
        setLoading(true);
        try {
            const { error } = await supabase.from('expenses').delete().eq('id', id);
            if (error) throw error;
            await refreshVehicles();
        } catch (e) {
            console.error(e);
            alert("Failed to delete expense");
        } finally {
            setLoading(false);
        }
    };

    const Content = (
        <div className="space-y-4">
            {/* Add Expense Form */}
            <div className="flex flex-col gap-3 bg-muted/30 p-4 rounded-lg border">
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="w-full sm:w-[150px] space-y-1">
                        <Label className="text-xs">Type</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Parts">Parts</SelectItem>
                                <SelectItem value="Labor">Labor</SelectItem>
                                <SelectItem value="Transport">Transport</SelectItem>
                                <SelectItem value="Auction Fee">Auction Fee</SelectItem>
                                <SelectItem value="Detailing">Detailing</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1 space-y-1">
                        <Label className="text-xs">Description</Label>
                        <Input
                            className="h-8"
                            placeholder="e.g. Bumper repair"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="w-full sm:w-[100px] space-y-1">
                        <Label className="text-xs">Amount ($)</Label>
                        <Input
                            className="h-8"
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button onClick={handleAddExpense} disabled={loading} size="sm">
                        <Plus className="w-3 h-3 mr-2" /> Add Expense
                    </Button>
                </div>
            </div>

            {/* Expenses Table */}
            <div className={`rounded-md border ${compact ? 'max-h-[300px] overflow-auto' : ''}`}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            {!compact && <TableHead>Description</TableHead>}
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="w-[40px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {expenses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={compact ? 4 : 5} className="text-center text-muted-foreground h-24">
                                    No expenses recorded.
                                </TableCell>
                            </TableRow>
                        ) : (
                            expenses
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map((expense) => (
                                    <TableRow key={expense.id}>
                                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                            {new Date(expense.date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            <Badge variant="outline" className="font-normal">{expense.expenseType}</Badge>
                                            {compact && expense.description && <div className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-[100px]">{expense.description}</div>}
                                        </TableCell>
                                        {!compact && <TableCell className="text-sm">{expense.description || "-"}</TableCell>}
                                        <TableCell className="text-right font-medium text-sm">
                                            ${expense.amount.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDeleteExpense(expense.id)}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                        )}
                        {expenses.length > 0 && (
                            <TableRow className="bg-muted/50 font-bold border-t-2">
                                <TableCell colSpan={compact ? 2 : 3} className="text-right text-xs uppercase text-muted-foreground">Total Expenses:</TableCell>
                                <TableCell className="text-right text-base">${totalExpenses.toFixed(2)}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );

    if (compact) {
        return Content;
    }

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-lg flex items-center">
                        <Receipt className="w-5 h-5 mr-2" />
                        Expenses & Repairs
                    </CardTitle>
                    <CardDescription>Detailed breakdown of restoration costs.</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                {Content}
            </CardContent>
        </Card>
    );
}
