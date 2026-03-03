'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/os/ui/Card";
import { Button } from "@/components/os/ui/Button";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import axios from "axios"; // Direct axios for proxy

export default function AdminLoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // POST to Next.js Proxy to set HttpOnly Cookie
            const res = await axios.post('/api/auth/proxy/login', { email, password });

            const { user } = res.data;

            if (user.role !== 'admin') {
                setError('Access denied. Admin portal only.');
                setIsLoading(false);
                return;
            }

            console.log("Login Success: Secured Cookie Set.");

            // Redirect (Middleware allows because cookie is set)
            window.location.href = '/admin';
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border-structura-border/60 shadow-xl backdrop-blur-sm bg-white/80">
            <CardHeader className="text-center pb-2">
                <CardTitle>Admin Portal</CardTitle>
                <p className="text-sm text-slate-500 mt-1">Authorized Personnel Only</p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
                            {error}
                        </div>
                    )}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-structura-black">Email or Username</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="admin@assuvar.com or username"
                                className="h-10 w-full rounded-lg border border-structura-border pl-10 pr-4 text-sm focus:border-structura-blue focus:outline-none focus:ring-1 focus:ring-structura-blue bg-white"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-structura-black">Password</label>
                            {/* Removed link for strict mode or keep it but it's manual */}
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="h-10 w-full rounded-lg border border-structura-border pl-10 pr-4 text-sm focus:border-structura-blue focus:outline-none focus:ring-1 focus:ring-structura-blue bg-white"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        isLoading={isLoading}
                    >
                        Sign In as Admin
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
