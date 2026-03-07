'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/os/ui/Card";
import { Button } from "@/components/os/ui/Button";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { toast } from 'sonner';

export default function SetupPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const id = searchParams.get('identifier');
        if (id) {
            setIdentifier(id);
        }
    }, [searchParams]);

    const handleSetup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            toast.error("Password too short");
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await axios.post('/api/auth/proxy/setup-password', {
                identifier,
                password
            });

            setIsSuccess(true);
            toast.success("Password set successfully!");

            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to setup password. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <Card className="max-w-md w-full border-green-100 bg-green-50/30 backdrop-blur-sm">
                    <CardContent className="pt-10 pb-10 text-center space-y-4">
                        <div className="flex justify-center">
                            <CheckCircle2 className="h-16 w-16 text-green-500 animate-pulse" />
                        </div>
                        <CardTitle className="text-2xl text-green-800">Password Set!</CardTitle>
                        <p className="text-green-700">
                            Your password has been successfully updated. You can now log in using your new credentials.
                        </p>
                        <div className="pt-4">
                            <Button variant="outline" className="border-green-200 text-green-700" onClick={() => window.location.href = '/login'}>
                                Go to Login Now
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-[400px] flex items-center justify-center">
            <Card className="max-w-md w-full border-structura-border/60 shadow-xl backdrop-blur-sm bg-white/80">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">Set Your Password</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">
                        Create a permanent password for your Assuvar account.
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSetup} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 italic">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Username / Email</label>
                            <input
                                type="text"
                                className="h-10 w-full rounded-md border border-slate-200 px-4 text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
                                value={identifier}
                                readOnly
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    className="h-10 w-full rounded-md border border-slate-200 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Confirm Password</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    type="password"
                                    placeholder="Confirm your password"
                                    className="h-10 w-full rounded-md border border-slate-200 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700"
                            isLoading={isLoading}
                        >
                            Update Password <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
