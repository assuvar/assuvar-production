'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/os/ui/Card";
import { Button } from "@/components/os/ui/Button";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ShieldCheck, ArrowRight, UserCheck } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function StaffLoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'identifier' | 'otp'>('identifier');

    const handleGetOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await axios.post('/api/auth/proxy/send-otp', {
                email: identifier
            });
            setStep('otp');
            toast.success("Login code sent to your email!");
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Failed to send code. Please check your credentials.';
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await axios.post('/api/auth/proxy/login', {
                email: identifier,
                otp
            });

            const { user } = res.data;
            toast.success(`Welcome back, ${user.name}!`);

            // Staff (Employee/Manager) specific redirect
            if (user.designation === 'Manager') {
                window.location.href = '/admin';
            } else {
                window.location.href = '/employee';
            }

        } catch (err: any) {
            const msg = err.response?.data?.message || 'Login failed. Please check your code.';
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[500px] flex flex-col items-center justify-center p-4">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-black text-slate-900 border-b-4 border-structura-blue inline-block pb-1">STAFF PORTAL</h1>
                <p className="text-slate-500 mt-2 font-medium">Internal Secure Access for Employees & Managers</p>
            </div>

            <Card className="max-w-md w-full border-structura-border/60 shadow-2xl bg-white">
                <CardHeader className="text-center pb-2">
                    <CardTitle>{step === 'identifier' ? 'Staff Sign In' : 'Verification Required'}</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">
                        {step === 'identifier'
                            ? 'Enter your official email to receive a secure login code'
                            : 'Enter the 6-digit code sent to your staff email'}
                    </p>
                </CardHeader>
                <CardContent>
                    {step === 'identifier' ? (
                        <form onSubmit={handleGetOTP} className="space-y-5">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 italic">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Official Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <input
                                        type="email"
                                        placeholder="your.name@company.com"
                                        className="h-11 w-full rounded-lg border border-slate-200 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none"
                                        required
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200"
                                isLoading={isLoading}
                            >
                                Get Secure OTP <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>

                            <div className="pt-4 text-center border-t">
                                <Link href="/login" className="text-xs text-slate-500 hover:text-indigo-600 font-medium">
                                    Admin or Client? Use Standard Login
                                </Link>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleLogin} className="space-y-5">
                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 italic">
                                    {error}
                                </div>
                            )}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 text-center block">Enter Security Code</label>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="••••••"
                                        maxLength={6}
                                        className="h-12 w-full rounded-lg border border-slate-200 pl-10 pr-4 text-lg focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none tracking-[0.8em] font-black text-center"
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 font-bold shadow-lg shadow-emerald-200"
                                isLoading={isLoading}
                            >
                                Verify & Access Dashboard
                            </Button>

                            <button
                                type="button"
                                onClick={() => setStep('identifier')}
                                className="w-full text-xs text-slate-500 hover:text-indigo-600 font-medium transition-colors"
                            >
                                Change email address
                            </button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
