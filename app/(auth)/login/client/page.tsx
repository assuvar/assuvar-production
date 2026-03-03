'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/os/ui/Card";
import { Button } from "@/components/os/ui/Button";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ShieldCheck, ArrowRight, UserCheck } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Turnstile } from '@marsidev/react-turnstile';

export default function ClientLoginPage() {
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
                setError("Client account not activated. Please use the verification code from your invitation first.");
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

            if (user.role !== 'client' && user.role !== 'admin') {
                setError('This login is for clients only.');
                setIsLoading(false);
                return;
            }

            toast.success("Welcome, Client!");
            window.location.href = '/client';

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
                    <div className="p-2 bg-blue-50 rounded-full">
                        <UserCheck className="h-6 w-6 text-blue-600" />
                    </div>
                </div>
                <CardTitle>{step === 'identifier' ? 'Client Login' : 'Client Access'}</CardTitle>
                <p className="text-sm text-slate-500 mt-1">
                    {step === 'identifier' ? 'Enter your client email to receive an access code' : 'Enter the code sent to your email'}
                </p>
            </CardHeader>
            <CardContent>
                {step === 'identifier' ? (
                    <form onSubmit={handleGetOTP} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 flex flex-col gap-2">
                                <span className="italic">{error}</span>
                                {error.toLowerCase().includes('activate') && (
                                    <Link href="/verify/client" className="text-xs font-bold underline flex items-center">
                                        Go to Client Activation <ArrowRight className="ml-1 h-3 w-3" />
                                    </Link>
                                )}
                            </div>
                        )}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Client Email or ID</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Enter your email"
                                    className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                                    required
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            isLoading={isLoading}
                        >
                            Get Access Code <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>

                        {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                            <div className="flex justify-center pt-2">
                                <Turnstile
                                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                                    onSuccess={(token) => setTurnstileToken(token)}
                                />
                            </div>
                        )}

                        <div className="pt-2 text-center text-xs text-slate-400">
                            Secure Client Access System
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
                            <label className="text-sm font-medium text-slate-700">6-Digit Access Code</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="••••••"
                                    maxLength={6}
                                    className="h-10 w-full rounded-lg border border-slate-200 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white tracking-[0.5em] font-bold text-center"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            isLoading={isLoading}
                        >
                            Verify & Enter Portal
                        </Button>

                        <button
                            type="button"
                            onClick={() => setStep('identifier')}
                            className="w-full text-xs text-slate-500 hover:text-blue-600 transition-colors"
                        >
                            Change email address
                        </button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}
