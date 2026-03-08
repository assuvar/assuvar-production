'use client';

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/os/ui/PageHeader";
import { Button } from "@/components/os/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/os/ui/Card";
import api from '@/lib/axios';

const LEAD_SOURCES = [
    'Website – Contact Page', 'Website – Landing Page', 'WhatsApp',
    'Phone Call', 'Email', 'Referral', 'Instagram', 'LinkedIn', 'Walk-in', 'Other'
];

const SERVICE_INTERESTS = [
    'Website', 'Web App', 'Mobile App', 'E-commerce',
    'SEO / Marketing', 'Automation', 'Not sure / Need guidance'
];

const BUDGET_RANGES = [
    'Not decided', '< 25k', '25k – 50k', '50k – 1L', '1L+'
];

const TIMELINES = [
    'Immediate', '1–2 weeks', '1 month', 'Flexible'
];

export default function CreateLeadPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [lookupLoading, setLookupLoading] = useState(false);
    const [clientIdInput, setClientIdInput] = useState('');
    const [staffList, setStaffList] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', source: '', notes: '',
        serviceInterest: [] as string[],
        companyName: '',
        budget: '', timeline: '', internalNotes: '', priority: 'Medium',
        existingClientId: '',
        leadType: 'Inbound',
        assignedTo: '',
        referralId: '',
        referralEmail: '',
        referralPercentage: 0
    });

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await api.get('/users');
                // Filter users to employees/admins who can take leads
                setStaffList(res.data.filter((u: any) => u.role === 'admin' || u.role === 'employee'));
            } catch (err) {
                console.error("Could not fetch staff list", err);
            }
        };
        fetchStaff();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleMultiSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const options = Array.from(e.target.selectedOptions, option => option.value);
        setFormData(prev => ({ ...prev, serviceInterest: options }));
    };

    const handleLookup = async (field: 'email' | 'clientId' | 'companyName', value: string) => {
        if (!value) return;
        setLookupLoading(true);
        try {
            const payload: any = {};
            payload[field] = value;
            const res = await api.post('/clients/lookup', payload);
            if (res.data) {
                const client = res.data;
                const sysNote = `[System Autofill]: Details fetched from existing Client Profile (${client.clientId})`;

                setFormData(prev => {
                    const existingNotes = prev.internalNotes || '';
                    const updatedNotes = existingNotes.includes(sysNote)
                        ? existingNotes
                        : (existingNotes ? existingNotes + '\n\n' + sysNote : sysNote);

                    return {
                        ...prev,
                        name: client.name || prev.name,
                        email: client.email || prev.email,
                        phone: client.phone || prev.phone,
                        companyName: client.companyName || prev.companyName,
                        existingClientId: client._id,
                        internalNotes: updatedNotes
                    };
                });

                if (!clientIdInput) setClientIdInput(client.clientId);
                if (field === 'clientId' && !formData.email) setFormData(prev => ({ ...prev, email: client.email }));
                alert(`Found Client: ${client.name} ${client.companyName ? `(${client.companyName})` : ''}. Details autofilled.`);
            }
        } catch (error) {
            if (field === 'clientId') console.warn("Client ID not found");
        } finally {
            setLookupLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...formData };
            if (!payload.assignedTo) delete (payload as any).assignedTo;
            await api.post('/leads', payload);
            router.push('/admin/leads');
        } catch (error: any) {
            console.error("Failed to create lead", error);
            alert(`Failed to create lead: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Create New Lead" description="Manually add a new lead to the system." />

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Client Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl text-sm flex gap-3">
                                <div className="mt-0.5">
                                    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold">Auto-Fetch Available</p>
                                    <p className="mt-0.5 text-blue-700">Add Business Email and Company Name to fetch the details of an existing client automatically.</p>
                                </div>
                            </div>

                            {/* Optional Client ID Lookup */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-purple-600">Existing Client ID (Optional)</label>
                                <input
                                    placeholder="e.g. ASV-C-XXXX..."
                                    value={clientIdInput}
                                    onChange={(e) => setClientIdInput(e.target.value)}
                                    onBlur={(e) => handleLookup('clientId', e.target.value)}
                                    className="w-full h-10 rounded-md border border-purple-200 bg-purple-50 px-3 placeholder:text-purple-300"
                                />
                                <p className="text-xs text-slate-500">Enter ID to autofill details if this lead comes from an existing client.</p>
                            </div>

                            <hr className="border-dashed border-slate-200 my-4" />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Lead Type *</label>
                                    <select name="leadType" value={formData.leadType} required className="w-full h-10 rounded-md border border-slate-300 px-3 bg-white" onChange={handleChange}>
                                        <option value="Inbound">Inbound (e.g. Website, Ad)</option>
                                        <option value="Outbound">Outbound (e.g. Cold Call, CSV List)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Source *</label>
                                    <select name="source" value={formData.source} required className="w-full h-10 rounded-md border border-slate-300 px-3 bg-white" onChange={handleChange}>
                                        <option value="">Select Source</option>
                                        {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>

                            {formData.source === 'Referral' && (
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-orange-50 border border-orange-100 rounded-md my-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-orange-800">Referral Name / ID</label>
                                        <input name="referralId" value={formData.referralId} className="w-full h-10 rounded-md border border-orange-200 px-3 bg-white" onChange={handleChange} placeholder="Referrer ID or Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-orange-800">Referrer Email</label>
                                        <input name="referralEmail" type="email" value={formData.referralEmail} className="w-full h-10 rounded-md border border-orange-200 px-3 bg-white" onChange={handleChange} placeholder="referrer@example.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-orange-800">Commission (%)</label>
                                        <input name="referralPercentage" type="number" min="0" max="100" value={formData.referralPercentage} className="w-full h-10 rounded-md border border-orange-200 px-3 bg-white" onChange={handleChange} />
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Business / Company Name *</label>
                                    <input name="companyName" value={formData.companyName} className="w-full h-10 rounded-md border border-slate-300 px-3" onChange={handleChange} onBlur={(e) => handleLookup('companyName', e.target.value)} placeholder="Acme Corp" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Contact Person</label>
                                    <input name="name" value={formData.name} required className="w-full h-10 rounded-md border border-slate-300 px-3" onChange={handleChange} placeholder="John Doe" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <input name="email" value={formData.email} type="email" className="w-full h-10 rounded-md border border-slate-300 px-3" onChange={handleChange} onBlur={(e) => handleLookup('email', e.target.value)} placeholder="john@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone</label>
                                    <input name="phone" value={formData.phone} className="w-full h-10 rounded-md border border-slate-300 px-3" onChange={handleChange} placeholder="+1 234 567 890" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Project Details (Optional)</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Service Interest (Hold Ctrl to select multiple)</label>
                                <select multiple name="serviceInterest" className="w-full h-32 rounded-md border border-slate-300 px-3 bg-white" onChange={handleMultiSelect}>
                                    {SERVICE_INTERESTS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Budget Range</label>
                                    <select name="budget" value={formData.budget} className="w-full h-10 rounded-md border border-slate-300 px-3 bg-white" onChange={handleChange}>
                                        <option value="">Select Budget</option>
                                        {BUDGET_RANGES.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Timeline</label>
                                    <select name="timeline" value={formData.timeline} className="w-full h-10 rounded-md border border-slate-300 px-3 bg-white" onChange={handleChange}>
                                        <option value="">Select Timeline</option>
                                        {TIMELINES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar / Internal */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Internal Use Only</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium">Assign To Staff</label>
                                    <a href="/admin/users/invite" className="text-xs text-blue-600 hover:underline">
                                        Assign new role to staff using access control
                                    </a>
                                </div>
                                <select name="assignedTo" value={formData.assignedTo} className="w-full h-10 rounded-md border border-slate-300 px-3 bg-white" onChange={handleChange}>
                                    <option value="">Auto-Assign (Admin)</option>
                                    {staffList.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Priority</label>
                                <select name="priority" value={formData.priority} className="w-full h-10 rounded-md border border-slate-300 px-3 bg-white" onChange={handleChange}>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Internal Notes</label>
                                <textarea name="internalNotes" value={formData.internalNotes} className="w-full h-24 rounded-md border border-slate-300 p-3 bg-white" placeholder="Admin assigned, initial thoughts..." onChange={handleChange} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Client Message</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Original Message / External Notes</label>
                                <textarea name="notes" value={formData.notes} className="w-full h-24 rounded-md border border-slate-300 p-3 bg-white" onChange={handleChange} />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-2">
                        <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" isLoading={loading} className="w-full">Save Lead</Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
