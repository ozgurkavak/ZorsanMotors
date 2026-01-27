import { supabaseAdmin } from "@/lib/supabase";
import {
    CheckCircle2,
    XCircle,
    AlertCircle,
    RefreshCcw,
    FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Since we are in a server component, we can fetch directly
async function getLogs() {
    // 50 logs should be enough for a quick view
    const { data, error } = await supabaseAdmin
        .from('sync_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) {
        console.error("Error fetching logs:", error);
        return [];
    }
    return data || [];
}

async function getSystemStatus() {
    const { data } = await supabaseAdmin
        .from('sync_heartbeats')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (!data) return 'OFFLINE';

    // Check if heartbeat is older than 2 hours (Script sends every 1 hour)
    const lastHeartbeat = new Date(data.created_at).getTime();
    const now = new Date().getTime();
    const diffHours = (now - lastHeartbeat) / (1000 * 60 * 60);

    return diffHours < 2 ? 'ONLINE' : 'OFFLINE';
}

export const revalidate = 0; // Disable cache for logs

export default async function SyncLogsPage() {
    const logs = await getLogs();
    const systemStatus = await getSystemStatus();

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Sync Logs</h1>
                    <div className="text-sm text-muted-foreground">Monitor automated inventory transfers from DealerCenter</div>
                </div>
                <div className="flex items-center gap-2">
                    {systemStatus === 'ONLINE' ? (
                        <Badge variant="outline" className="flex gap-1 items-center px-3 py-1 border-green-500/50 bg-green-500/10 text-green-700">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            System Online
                        </Badge>
                    ) : (
                        <Badge variant="destructive" className="flex gap-1 items-center px-3 py-1">
                            <div className="w-2 h-2 rounded-full bg-white" />
                            System Offline
                        </Badge>
                    )}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]"></TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Message</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead className="text-right">Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                        No logs found yet. Waiting for the first sync...
                                    </TableCell>
                                </TableRow>
                            )}
                            {logs.map((log) => (
                                <TableRow key={log.id}>
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
                                    <TableCell className="max-w-[300px] truncate text-muted-foreground text-sm font-mono">
                                        {JSON.stringify(log.details)}
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground">
                                        {new Date(log.created_at).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
