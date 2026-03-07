'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { PageHeader } from '@/components/os/ui/PageHeader';
import { Button } from '@/components/os/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/os/ui/Card';
import { StatusBadge } from '@/components/os/ui/StatusBadge';
import {
    ArrowLeft, Briefcase, FileText, CalendarDays,
    DollarSign, Mail, Phone, User, Hash, Wrench, Clock
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Editable operational fields
    const [maintenanceDate, setMaintenanceDate] = useState('');
    const [operationalCost, setOperationalCost] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchData(); }, [id]);

    const fetchData = async () => {
        try {
            const res = await api.get(`/clients/${id}`);
            setData(res.data);
            if (res.data.profile.maintenanceDate) {
                setMaintenanceDate(new Date(res.data.profile.maintenanceDate).toISOString().split('T')[0]);
            }
            if (res.data.profile.operationalCost) {
                setOperationalCost(res.data.profile.operationalCost.toString());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.patch(`/clients/${id}`, {
                maintenanceDate: maintenanceDate || undefined,
                operationalCost: operationalCost ? Number(operationalCost) : 0,
            });
            toast.success('Client details updated');
            fetchData();
        } catch (err) {
            toast.error('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-slate-500">Loading...</div>;
    if (!data) return <div className="p-8 text-slate-500">Client not found.</div>;

    const { profile, sale, project } = data;
    const lead = sale?.quoteId?.leadId || {};
    const quote = sale?.quoteId || {};

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            <div className="flex items-center gap-4 mb-2">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-slate-500">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
            </div>

            <PageHeader
                title={profile.contactPerson}
                description={`Client ID: ${profile.clientId || '—'} • ${profile.email}`}
            >
                <span className="font-mono text-sm font-bold text-structura-blue bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg">
                    {profile.clientId || 'NO ID'}
                </span>
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT: Client Info + Quotation + Project */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Client Info Card */}
                    <Card>
                        <CardHeader className="border-b bg-slate-50 pb-4">
                            <CardTitle className="text-base flex items-center gap-2">
                                <User className="h-4 w-4 text-slate-500" /> Client Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Contact Person</p>
                                        <p className="font-medium text-structura-black">{profile.contactPerson}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Company</p>
                                        <p className="font-medium text-structura-black">{profile.companyName || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-slate-400 mb-1 flex items-center gap-1">
                                            <Mail className="h-3 w-3" /> Email
                                        </p>
                                        <p className="text-slate-700">{profile.email}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-slate-400 mb-1 flex items-center gap-1">
                                            <Phone className="h-3 w-3" /> Phone
                                        </p>
                                        <p className="text-slate-700">{profile.phone || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-slate-400 mb-1 flex items-center gap-1">
                                            <Hash className="h-3 w-3" /> Client ID
                                        </p>
                                        <p className="font-mono text-structura-blue font-bold">{profile.clientId || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Registered On</p>
                                        <p className="text-slate-700">{formatDate(profile.createdAt)}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quotation Card */}
                    {sale && (
                        <Card>
                            <CardHeader className="border-b bg-slate-50 pb-4">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-slate-500" /> Quotation Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="grid grid-cols-3 gap-6">
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Quotation ID</p>
                                        <p className="font-mono text-sm font-bold text-slate-700">{quote.quotationId || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Sale ID</p>
                                        <p className="font-mono text-sm font-bold text-slate-700">{sale.saleId || '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Payment Status</p>
                                        <StatusBadge status={sale.paymentStatus} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Total Value</p>
                                        <p className="text-lg font-bold text-structura-black">
                                            {sale.currency} {sale.totalAmount?.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Paid</p>
                                        <p className="text-lg font-bold text-green-600">
                                            {sale.currency} {sale.paidAmount?.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Pending</p>
                                        <p className="text-lg font-bold text-red-500">
                                            {sale.currency} {sale.pendingAmount?.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-2 flex gap-3">
                                    <Link href={`/admin/sales/${sale._id}`}>
                                        <Button variant="outline" size="sm">
                                            <FileText className="h-3.5 w-3.5 mr-1.5" /> Open Sale
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Project Card */}
                    {project ? (
                        <Card>
                            <CardHeader className="border-b bg-green-50 pb-4">
                                <CardTitle className="text-base flex items-center gap-2 text-green-800">
                                    <Briefcase className="h-4 w-4" /> Project Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Project Name</p>
                                        <p className="font-semibold text-structura-black">{project.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Status</p>
                                        <StatusBadge status={project.status} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Start Date</p>
                                        <p className="text-slate-700">{formatDate(project.startDate)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase text-slate-400 mb-1">Target End</p>
                                        <p className="text-slate-700">{formatDate(project.endDate)}</p>
                                    </div>
                                </div>
                                <Link href={`/admin/projects/${project._id}`}>
                                    <Button variant="outline" size="sm">
                                        <Briefcase className="h-3.5 w-3.5 mr-1.5" /> Open Project Workspace
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="p-6 text-center text-slate-400">
                                <Briefcase className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                                <p className="text-sm">No project initiated yet.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* RIGHT: Operational Details Panel */}
                <div className="space-y-6">
                    <Card className="border-t-4 border-t-structura-blue shadow-sm">
                        <CardHeader className="border-b bg-slate-50 pb-4">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Wrench className="h-4 w-4 text-structura-blue" /> Operational Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            <div>
                                <label className="text-xs font-semibold uppercase text-slate-400 block mb-2 flex items-center gap-1">
                                    <CalendarDays className="h-3.5 w-3.5" /> Maintenance Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full h-10 border border-slate-300 rounded-lg px-3 text-sm focus:ring-2 focus:ring-structura-blue focus:border-transparent transition"
                                    value={maintenanceDate}
                                    onChange={e => setMaintenanceDate(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold uppercase text-slate-400 block mb-2 flex items-center gap-1">
                                    <DollarSign className="h-3.5 w-3.5" /> Operational Cost
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-bold">
                                        {sale?.currency || '₹'}
                                    </span>
                                    <input
                                        type="number"
                                        className="w-full h-10 border border-slate-300 rounded-lg pl-8 pr-3 text-sm focus:ring-2 focus:ring-structura-blue focus:border-transparent transition"
                                        placeholder="0"
                                        value={operationalCost}
                                        onChange={e => setOperationalCost(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button
                                className="w-full bg-structura-blue hover:bg-structura-blue/90"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Payment History Summary */}
                    {sale?.payments?.length > 0 && (
                        <Card>
                            <CardHeader className="border-b bg-slate-50 pb-4">
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-slate-500" /> Payment History
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y max-h-64 overflow-y-auto">
                                    {sale.payments.map((p: any, i: number) => (
                                        <div key={i} className="flex justify-between px-4 py-3 text-sm">
                                            <div>
                                                <p className="text-slate-600 text-xs">{formatDate(p.date)}</p>
                                                <p className="text-xs text-slate-400 italic truncate max-w-[140px]">{p.note}</p>
                                            </div>
                                            <p className="font-bold text-green-600">+{sale.currency} {p.amount?.toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
