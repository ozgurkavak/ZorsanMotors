"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Trash2, Loader2, User, Phone, Clock } from "lucide-react";
import { getContactMessages, deleteMessage } from "@/app/actions/admin";

export function MessagesDialog() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Initial load for count
    useEffect(() => {
        loadMessages(false);
    }, []);

    // Reload when opened to be sure
    useEffect(() => {
        if (open) {
            loadMessages(true);
        }
    }, [open]);

    async function loadMessages(showLoading = true) {
        if (showLoading) setLoading(true);
        const data = await getContactMessages();
        setMessages(data);
        if (showLoading) setLoading(false);
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this message?")) return;
        await deleteMessage(id);
        setMessages(prev => prev.filter(m => m.id !== id));
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Mail className="h-4 w-4" />
                    Inbox
                    {messages.length > 0 && (
                        <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                            {messages.length}
                        </span>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>Inbox</DialogTitle>
                    <DialogDescription>Messages from contact form.</DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-1 space-y-4">
                    {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                    ) : messages.length === 0 ? (
                        <div className="text-center p-8 text-muted-foreground">No messages found.</div>
                    ) : (
                        messages.map((msg) => (
                            <div key={msg.id} className="border rounded-lg p-4 bg-muted/20 relative group hover:bg-muted/40 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-2 items-center font-semibold">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        {msg.first_name} {msg.last_name}
                                    </div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {new Date(msg.created_at).toLocaleString()}
                                    </div>
                                </div>

                                <div className="text-sm text-muted-foreground mb-3 flex flex-col gap-1">
                                    <div className="flex gap-2 items-center">
                                        <Mail className="h-3 w-3" /> <a href={`mailto:${msg.email}`} className="hover:underline text-primary">{msg.email}</a>
                                    </div>
                                    {msg.phone && (
                                        <div className="flex gap-2 items-center">
                                            <Phone className="h-3 w-3" /> <a href={`tel:${msg.phone}`} className="hover:underline">{msg.phone}</a>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-background p-3 rounded-md border text-sm whitespace-pre-wrap">
                                    {msg.message}
                                </div>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handleDelete(msg.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
