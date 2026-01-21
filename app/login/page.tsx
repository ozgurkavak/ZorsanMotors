"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lock } from "lucide-react";

export default function LoginPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "admin123") { // Mock password
            // Set cookie manually for demo (in real app use server action or API)
            document.cookie = "admin_session=true; path=/; max-age=3600";
            router.push("/admin");
        } else {
            setError("Invalid password");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/20">
            <Card className="w-full max-w-sm">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                        <Lock className="h-6 w-6 text-primary" /> Admin Access
                    </CardTitle>
                    <CardDescription>Enter your password to access the dashboard.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {error && <p className="text-sm text-red-500">{error}</p>}
                        </div>
                        <Button type="submit" className="w-full">Sign In</Button>
                        <div className="text-xs text-center text-muted-foreground mt-4">
                            Hint: Password is <strong>admin123</strong>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
