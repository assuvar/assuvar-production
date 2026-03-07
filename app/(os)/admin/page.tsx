'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import {
    Users, FileText, Briefcase,
    TrendingUp, CheckCircle2, XCircle,
    Clock, AlertCircle, Copy,
    RefreshCcw, UserCheck, CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/os/ui/PageHeader";
import { Card, CardContent } from "@/components/os/ui/Card";
import { Button } from "@/components/os/ui/Button";
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/stats/dashboard');
            setStats(res.data);
        } catch (error) {
            console.error("Failed to fetch dashboard stats", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !stats) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-structura-blue"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            <PageHeader
                title="Dashboard Overview"
                description="Real-time performance metrics across your business pipeline."
            >
                <div className="flex gap-3">
                    <Link href="/admin/leads/create">
                        <Button variant="outline" size="sm">New Lead</Button>
                    </Link>
                    <Link href="/admin/quotes/create">
                        <Button size="sm">Create Quote</Button>
                    </Link>
                </div>
            </PageHeader>

            {/* --- LEADS SECTION --- */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        Leads Pipeline
                    </h2>
                    <Link href="/admin/leads" className="text-sm font-medium text-blue-600 hover:underline">View All Leads</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Leads"
                        value={stats.leads.total}
                        icon={Users}
                        color="blue"
                        details={`New: ${stats.leads.new} | Contacted: ${stats.leads.contacted}`}
                    />
                    <StatCard
                        title="Follow-up Required"
                        value={stats.leads.followUp}
                        icon={Clock}
                        color="amber"
                        details="Needs immediate attention"
                    />
                    <StatCard
                        title="Quoted Leads"
                        value={stats.leads.quoted}
                        icon={FileText}
                        color="indigo"
                        details={`${stats.leads.interested} expressing interest`}
                    />
                    <StatCard
                        title="Converted (Accepted)"
                        value={stats.leads.accepted}
                        icon={CheckCircle2}
                        color="emerald"
                        details="Successfully onboarded"
                    />
                </div>
            </section>

            {/* --- QUOTATIONS SECTION --- */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-indigo-600" />
                        Quotations & Proposals
                    </h2>
                    <Link href="/admin/quotes" className="text-sm font-medium text-indigo-600 hover:underline">Manage Quotes</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatCard
                        title="Active Proposals"
                        value={stats.quotes.total}
                        icon={TrendingUp}
                        color="indigo"
                        details={`Drafts: ${stats.quotes.draft} | Sent: ${stats.quotes.sent}`}
                    />
                    <StatCard
                        title="Client Responses"
                        value={stats.quotes.accepted}
                        icon={CheckCircle2}
                        color="emerald"
                        details={`${stats.quotes.rejected} Rejected by client`}
                    />
                    <StatCard
                        title="Revisions Requested"
                        value={stats.quotes.revisionRequested}
                        icon={RefreshCcw}
                        color="orange"
                        highlight={stats.quotes.revisionRequested > 0}
                        details="Requires staff action"
                    />
                </div>
            </section>

            {/* --- SALES SECTION --- */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                        Sales & Revenue
                    </h2>
                    <Link href="/admin/sales" className="text-sm font-medium text-emerald-600 hover:underline">View Sales</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Sales"
                        value={stats.sales.total}
                        icon={Briefcase}
                        color="emerald"
                        details={`${stats.sales.thisMonth} new this month`}
                    />
                    <StatCard
                        title="Converted to Project"
                        value={stats.sales.convertedToProject}
                        icon={Briefcase}
                        color="blue"
                        details="Projects actively initiated"
                    />
                    <StatCard
                        title="Partial Payments"
                        value={stats.sales.partial}
                        icon={CreditCard}
                        color="amber"
                        details="Awaiting full settlement"
                    />
                    <StatCard
                        title="Pending Collection"
                        value={stats.sales.pending}
                        icon={AlertCircle}
                        color="rose"
                        details="Payment not yet started"
                    />
                </div>
            </section>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, details, highlight }: any) {
    const colorMap: any = {
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        amber: "text-amber-600 bg-amber-50 border-amber-100",
        indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
        orange: "text-orange-600 bg-orange-50 border-orange-100",
        rose: "text-rose-600 bg-rose-50 border-rose-100",
    };

    const iconColorMap: any = {
        blue: "text-blue-500",
        amber: "text-amber-500",
        indigo: "text-indigo-500",
        emerald: "text-emerald-500",
        orange: "text-orange-500",
        rose: "text-rose-500",
    };

    return (
        <Card className={cn(
            "relative overflow-hidden transition-all duration-300 hover:shadow-md border-slate-200",
            highlight && "ring-2 ring-orange-500 ring-offset-2 animate-pulse-subtle"
        )}>
            <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
                        <h3 className="text-3xl font-black text-slate-900">{value}</h3>
                    </div>
                    <div className={cn("p-2.5 rounded-xl border", colorMap[color])}>
                        <Icon className={cn("h-6 w-6", iconColorMap[color])} />
                    </div>
                </div>

                {details && (
                    <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[11px] font-medium text-slate-500 leading-tight">
                            {details}
                        </span>
                        {highlight && (
                            <span className="flex h-2 w-2 rounded-full bg-orange-500"></span>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
