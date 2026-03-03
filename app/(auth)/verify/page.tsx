'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/os/ui/Card";
import { Button } from "@/components/os/ui/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { toast } from 'sonner';

export default function VerifyPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [identifier, setIdentifier] = useState('');
    const [code, setCode] = useState('');

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Forward to proxy if needed, but for now assuming direct or simple proxy
            const res = await axios.post('/api/auth/proxy/verify', {
                email: identifier,
                code
            });

            setIsSuccess(true);
            toast.success("Account verified successfully!");

            // Wait 2 seconds then redirect to login
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);

        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Verification failed. Please check your code.';
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
                        <CardTitle className="text-2xl text-green-800">Account Verified!</CardTitle>
                        <p className="text-green-700">
                            Your account is now active. We are redirecting you to the login page where you can sign in using a dynamic OTP.
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
                    <CardTitle className="text-xl">Activate Your Account</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">
                        Enter your email and the 6-digit invitation code sent to your inbox.
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleVerify} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 italic">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Email or Username</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Enter your email or username"
                                    className="h-10 w-full rounded-md border border-slate-200 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                                    required
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Invitation Code</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="••••••"
                                    maxLength={6}
                                    className="h-10 w-full rounded-md border border-slate-200 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white tracking-[0.5em] font-bold text-center"
                                    required
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700"
                            isLoading={isLoading}
                        >
                            Verify & Activate <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
