"use client";

import { Log } from "@/types"; // Make sure Log type is available or define inline
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Define a minimal type if needed, or import full Database Type
interface SyncLogItemProps {
    log: any; // Using any for flexibility with Supabase response
}

export function SyncLogItem({ log }: SyncLogItemProps) {
    return (
        <TableRow className="hover:bg-muted/50">
            <TableCell>
                {log.event_type === 'SYNC_SUCCESS' && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
                {log.event_type === 'SYNC_ERROR' && (
                    <XCircle className="h-5 w-5 text-red-500" />
                )}
                {!['SYNC_SUCCESS', 'SYNC_ERROR'].includes(log.event_type) && (
                    <AlertCircle className="h-5 w-5 text-blue-500" />
                )}
            </TableCell>
            <TableCell>
                <Badge variant={log.event_type === 'SYNC_ERROR' ? 'destructive' : 'secondary'}>
                    {log.event_type}
                </Badge>
            </TableCell>
            <TableCell className="font-medium">
                {log.message}
            </TableCell>
            <TableCell>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 flex items-center gap-1 text-blue-600 hover:text-blue-800">
                            <Eye className="w-3 h-3" />
                            View Details
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Log Details - {log.event_type}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="text-sm text-muted-foreground">
                                Timestamp: {new Date(log.created_at).toLocaleString()}
                            </div>
                            <div className="rounded-md bg-slate-950 p-4 font-mono text-xs text-white overflow-auto">
                                <pre>{JSON.stringify(log.details, null, 2)}</pre>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </TableCell>
            <TableCell className="text-right text-muted-foreground text-sm">
                {new Date(log.created_at).toLocaleString()}
            </TableCell>
        </TableRow>
    );
}
