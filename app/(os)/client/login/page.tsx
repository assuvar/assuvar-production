'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/os/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/os/ui/Card';
import { useAuth } from '@/hooks/useAuth'; // Assuming this hook exists or we use direct API
import api from '@/lib/axios';
import { Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function ClientLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth(); // Or we can use API directly if hook not tailored

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Using standard auth endpoint
            const res = await api.post('/auth/login', {
                email, // Auth controller usually expects email
                password
            });

            const { token, user } = res.data;

            if (user.role !== 'client') {
                toast.error("Access Restricted. This portal is for Clients only.");
                setLoading(false);
                return;
            }

            // Store token & Redirect
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            toast.success("Welcome back!");
            router.push('/client/dashboard');

        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="w-full max-w-md p-4">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-structura-black">Client Portal</h1>
                    <p className="text-slate-500">Secure access to your project documents & invoices</p>
                </div>

                <Card className="border-purple-100 shadow-lg">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-xl">Sign In</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-9 h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="name@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="password"
                                        required
                                        className="w-full pl-9 h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-purple-600 hover:bg-purple-700"
                                disabled={loading}
                            >
                                {loading ? 'Signing In...' : 'Access Dashboard'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center text-xs text-slate-400">
                        Protected by Secure Client Access
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
