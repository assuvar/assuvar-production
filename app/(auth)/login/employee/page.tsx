'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/os/ui/Card";
import { Button } from "@/components/os/ui/Button";
import Link from "next/link";
import { useState } from "react";
import { Mail, ShieldCheck, ArrowRight, Briefcase } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Turnstile } from '@marsidev/react-turnstile';

export default function EmployeeLoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [turnstileToken, setTurnstileToken] = useState<string>('');
    const [step, setStep] = useState<'identifier' | 'otp'>('identifier');

    const handleGetOTP = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!turnstileToken && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
            toast.error("Please complete the security check.");
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await axios.post('/api/auth/proxy/send-otp', {
                email: identifier,
                turnstileToken
            });
            setStep('otp');
            toast.success("OTP sent to your email!");
        } catch (err: any) {
            if (err.response?.status === 403) {
                setError("Employee account not active. Please use the activation link from your workspace invitation.");
                toast.error("Activation required");
            } else {
                const msg = err.response?.data?.message || 'Failed to send OTP. Please check your credentials.';
                setError(msg);
                toast.error(msg);
            }
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
                otp,
                turnstileToken
            });

            const { user } = res.data;

            if (user.role !== 'employee' && user.role !== 'admin') {
                setError('This login is for employees only.');
                setIsLoading(false);
                return;
            }

            toast.success("Welcome, Team!");
            window.location.href = '/employee/dashboard';

        } catch (err: any) {
            const msg = err.response?.data?.message || 'Login failed. Please check your code.';
            setError(msg);
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border-structura-border/60 shadow-xl backdrop-blur-sm bg-white/80">
            <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-2">
                    <div className="p-2 bg-indigo-50 rounded-full">
                        <Briefcase className="h-6 w-6 text-indigo-600" />
                    </div>
                </div>
                <CardTitle>{step === 'identifier' ? 'Employee Login' : 'Team Access'}</CardTitle>
                <p className="text-sm text-slate-500 mt-1">
                    {step === 'identifier' ? 'Enter your employee identifier to receive a login code' : 'Enter the code sent to your email'}
                </p>
            </CardHeader>
            <CardContent>
                {step === 'identifier' ? (
                    <form onSubmit={handleGetOTP} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 flex flex-col gap-2">
                                <span className="italic">{error}</span>
                                {error.toLowerCase().includes('active') && (
                                    <Link href="/verify/employee" className="text-xs font-bold underline flex items-center">
                                        Go to Activation Page <ArrowRight className="ml-1 h-3 w-3" />
                                    </Link>
                                )}
                            </div>
                        )}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Workspace Email or ID</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Enter your email"
                                    className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                                    required
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                            isLoading={isLoading}
                        >
                            Get Security Code <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>

                        {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                            <div className="flex justify-center pt-2">
                                <Turnstile
                                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                                    onSuccess={(token) => setTurnstileToken(token)}
                                />
                            </div>
                        )}

                        <div className="pt-2 text-center text-xs text-slate-400 font-medium">
                            Assuvar Workspace Access
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 italic">
                                {error}
                            </div>
                        )}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Verification Code</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="••••••"
                                    maxLength={6}
                                    className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white tracking-[0.5em] font-bold text-center"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                            isLoading={isLoading}
                        >
                            Log in to Workspace
                        </Button>

                        <button
                            type="button"
                            onClick={() => setStep('identifier')}
                            className="w-full text-xs text-slate-500 hover:text-indigo-600 transition-colors"
                        >
                            Back to identifier entry
                        </button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}
