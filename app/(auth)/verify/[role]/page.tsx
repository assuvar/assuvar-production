'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/os/ui/Card";
import { Button } from "@/components/os/ui/Button";
import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Mail, ShieldCheck, ArrowRight, CheckCircle2, UserCheck, Briefcase, Handshake } from "lucide-react";
import axios from "axios";
import { toast } from 'sonner';

interface VerifyRolePageProps {
    params: Promise<{ role: string }>;
}

export default function VerifyRolePage({ params }: VerifyRolePageProps) {
    const { role } = use(params);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [identifier, setIdentifier] = useState('');
    const [code, setCode] = useState('');

    const roleConfig: Record<string, {
        title: string,
        icon: any,
        color: string,
        borderClass: string,
        bgClass: string,
        textClass: string,
        btnClass: string,
        accentColor: string,
        loginPath: string
    }> = {
        client: {
            title: 'Client Activation',
            icon: UserCheck,
            color: 'blue',
            borderClass: 'border-blue-100',
            bgClass: 'bg-blue-50/30',
            textClass: 'text-blue-700',
            btnClass: 'bg-blue-600 hover:bg-blue-700',
            accentColor: 'text-blue-500',
            loginPath: '/login/client'
        },
        employee: {
            title: 'Employee Activation',
            icon: Briefcase,
            color: 'indigo',
            borderClass: 'border-indigo-100',
            bgClass: 'bg-indigo-50/30',
            textClass: 'text-indigo-700',
            btnClass: 'bg-indigo-600 hover:bg-indigo-700',
            accentColor: 'text-indigo-500',
            loginPath: '/login/employee'
        },
        partner: {
            title: 'Partner Activation',
            icon: Handshake,
            color: 'emerald',
            borderClass: 'border-emerald-100',
            bgClass: 'bg-emerald-50/30',
            textClass: 'text-emerald-700',
            btnClass: 'bg-emerald-600 hover:bg-emerald-700',
            accentColor: 'text-emerald-500',
            loginPath: '/login/partner'
        }
    };

    const config = roleConfig[role] || {
        title: 'Account Activation',
        icon: ShieldCheck,
        color: 'purple',
        borderClass: 'border-purple-100',
        bgClass: 'bg-purple-50/30',
        textClass: 'text-purple-700',
        btnClass: 'bg-purple-600 hover:bg-purple-700',
        accentColor: 'text-purple-500',
        loginPath: '/login'
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await axios.post('/api/auth/proxy/verify', {
                email: identifier,
                code
            });

            setIsSuccess(true);
            toast.success("Account activated successfully!");

            // Wait 2 seconds then redirect to specific login
            setTimeout(() => {
                window.location.href = config.loginPath;
            }, 2500);

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
            <div className="min-h-[400px] flex items-center justify-center p-4">
                <Card className={`max-w-md w-full ${config.borderClass} ${config.bgClass} backdrop-blur-sm`}>
                    <CardContent className="pt-10 pb-10 text-center space-y-4">
                        <div className="flex justify-center">
                            <CheckCircle2 className={`h-16 w-16 ${config.accentColor} animate-pulse`} />
                        </div>
                        <CardTitle className={`text-2xl font-bold`}>Account Verified!</CardTitle>
                        <p className={`${config.textClass}`}>
                            Your {role} account is now active. We are redirecting you to your dedicated login page.
                        </p>
                        <div className="pt-4">
                            <Button
                                variant="outline"
                                className={`${config.borderClass} ${config.textClass}`}
                                onClick={() => window.location.href = config.loginPath}
                            >
                                Go to {role.charAt(0).toUpperCase() + role.slice(1)} Login
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const Icon = config.icon;

    return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
            <Card className="max-w-md w-full border-structura-border/60 shadow-xl backdrop-blur-sm bg-white/80 overflow-hidden">
                <div className={`h-1.5 ${config.btnClass.split(' ')[0]} w-full`} />
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-2">
                        <Icon className={`h-8 w-8 text-${config.color}-600`} />
                    </div>
                    <CardTitle className="text-xl">Activate {role.charAt(0).toUpperCase() + role.slice(1)} Account</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">
                        Use the invitation code sent to your {role} email address.
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleVerify} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100 italic font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">Registration Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder={`Enter your ${role} email`}
                                    className="h-10 w-full rounded-md border border-slate-200 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white"
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
                                    className="h-10 w-full rounded-md border border-slate-200 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white tracking-[0.5em] font-bold text-center"
                                    required
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className={`w-full ${config.btnClass} text-white`}
                            isLoading={isLoading}
                        >
                            Complete Activation <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>

                        <div className="pt-1 text-center">
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                                Secure Onboarding System
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
