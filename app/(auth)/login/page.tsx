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

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [identifier, setIdentifier] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [turnstileToken, setTurnstileToken] = useState<string>('');
    const [step, setStep] = useState<'identifier' | 'otp'>('identifier');
    const [loginMode, setLoginMode] = useState<'otp' | 'password'>('password');

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
                setError("Account not verified. Please verify using the invitation code first.");
                toast.error("Verification required");
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
            const loginData: any = {
                email: identifier,
                turnstileToken
            };

            if (loginMode === 'otp') {
                loginData.otp = otp;
            } else {
                loginData.password = password;
            }

            const res = await axios.post('/api/auth/proxy/login', loginData);

            const { user } = res.data;
            toast.success("Welcome back!");

            // Redirect based on role and designation
            if (user.role === 'admin') window.location.href = '/admin';
            else if (user.role === 'client') window.location.href = '/client';
            else if (user.role === 'employee') {
                if (user.designation === 'Manager') window.location.href = '/admin';
                else window.location.href = '/employee';
            }
            else if (user.role === 'partner') window.location.href = '/partner';
            else window.location.href = '/';

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
                <CardTitle>{step === 'identifier' ? 'Sign In' : 'Account Access'}</CardTitle>
                <p className="text-sm text-slate-500 mt-1">
                    {step === 'identifier'
                        ? (loginMode === 'otp' ? 'Enter your email/username to receive a login code' : 'Enter your credentials to access your account')
                        : 'Enter the code sent to your email'}
                </p>
            </CardHeader>
            <CardContent>
                <div className="flex border-b border-structura-border mb-6">
                    <button
                        onClick={() => { setLoginMode('otp'); setStep('identifier'); }}
                        className={`flex-1 py-2 text-sm font-medium transition-colors ${loginMode === 'otp' ? 'text-structura-blue border-b-2 border-structura-blue' : 'text-slate-400'}`}
                    >
                        OTP Login
                    </button>
                    <button
                        onClick={() => { setLoginMode('password'); setStep('identifier'); }}
                        className={`flex-1 py-2 text-sm font-medium transition-colors ${loginMode === 'password' ? 'text-structura-blue border-b-2 border-structura-blue' : 'text-slate-400'}`}
                    >
                        Password Login
                    </button>
                </div>

                {step === 'identifier' ? (
                    <form onSubmit={loginMode === 'otp' ? handleGetOTP : handleLogin} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 flex flex-col gap-2">
                                <span className="italic">{error}</span>
                                {error.includes('verify') && (
                                    <Link href="/verify" className="text-xs font-bold underline flex items-center">
                                        Go to Activation Page <ArrowRight className="ml-1 h-3 w-3" />
                                    </Link>
                                )}
                            </div>
                        )}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-structura-black">Email or Username</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Email or Username"
                                    className="h-10 w-full rounded-lg border border-structura-border pl-10 pr-4 text-sm focus:border-structura-blue focus:outline-none focus:ring-1 focus:ring-structura-blue bg-white"
                                    required
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                />
                            </div>
                        </div>

                        {loginMode === 'password' && (
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-structura-black">Password</label>
                                <div className="relative">
                                    <ShieldCheck className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="password"
                                        placeholder="Your Password"
                                        className="h-10 w-full rounded-lg border border-structura-border pl-10 pr-4 text-sm focus:border-structura-blue focus:outline-none focus:ring-1 focus:ring-structura-blue bg-white"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isLoading}
                        >
                            {loginMode === 'otp' ? 'Get Login Code' : 'Sign In'} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>

                        {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                            <div className="flex justify-center pt-2">
                                <Turnstile
                                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                                    onSuccess={(token) => setTurnstileToken(token)}
                                />
                            </div>
                        )}

                        <div className="pt-2 text-center">
                            <Link href="/verify" className="text-xs text-slate-500 hover:text-structura-blue flex items-center justify-center">
                                <UserCheck className="mr-1.5 h-3 w-3" /> First time inviting? Activate here
                            </Link>
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
                            <label className="text-sm font-medium text-structura-black">Enter OTP Code</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="••••••"
                                    maxLength={6}
                                    className="h-10 w-full rounded-lg border border-structura-border pl-10 pr-4 text-sm focus:border-structura-blue focus:outline-none focus:ring-1 focus:ring-structura-blue bg-white tracking-[0.5em] font-bold text-center"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isLoading}
                        >
                            Sign In to Portal
                        </Button>

                        <button
                            type="button"
                            onClick={() => setStep('identifier')}
                            className="w-full text-xs text-slate-500 hover:text-structura-blue transition-colors"
                        >
                            Back to email entry
                        </button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}
