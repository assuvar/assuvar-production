'use client';

import { useState, useEffect, use } from 'react';
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

export default function EditLeadPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
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
        const fetchStaffAndLead = async () => {
            try {
                // Fetch Staff
                const res = await api.get('/users');
                setStaffList(res.data.filter((u: any) => u.role === 'admin' || u.role === 'employee'));

                // Fetch Lead
                const leadRes = await api.get(`/leads/${id}`);
                const lead = leadRes.data;

                setFormData({
                    name: lead.name || '',
                    email: lead.email || '',
                    phone: lead.phone || '',
                    source: lead.source || '',
                    notes: lead.notes || '',
                    serviceInterest: lead.serviceInterest || [],
                    companyName: lead.companyName || '',
                    budget: lead.budget || '',
                    timeline: lead.timeline || '',
                    internalNotes: lead.internalNotes || '',
                    priority: lead.priority || 'Medium',
                    existingClientId: lead.existingClientId || '',
                    leadType: lead.leadType || 'Inbound',
                    assignedTo: lead.assignedTo?._id || lead.assignedTo || '',
                    referralId: lead.referralId || '',
                    referralEmail: lead.referralEmail || '',
                    referralPercentage: lead.referralPercentage || 0
                });
            } catch (err) {
                console.error("Could not fetch data", err);
                alert("Failed to load Lead Data");
            } finally {
                setFetching(false);
            }
        };
        fetchStaffAndLead();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleMultiSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const options = Array.from(e.target.selectedOptions, option => option.value);
        setFormData(prev => ({ ...prev, serviceInterest: options }));
    };

    const handleLookup = async (field: 'email' | 'clientId', value: string) => {
        if (!value) return;
        setLookupLoading(true);
        try {
            const payload = field === 'clientId' ? { clientId: value } : { email: value };
            const res = await api.post('/clients/lookup', payload);
            if (res.data) {
                const client = res.data;
                setFormData(prev => ({
                    ...prev,
                    name: client.name,
                    email: client.email,
                    phone: client.phone || prev.phone,
                    companyName: client.companyName || prev.companyName,
                    existingClientId: client._id
                }));
                if (field === 'email' && !clientIdInput) setClientIdInput(client.clientId);
                if (field === 'clientId' && !formData.email) setFormData(prev => ({ ...prev, email: client.email }));
                alert(`Found Client: ${client.name}. Details autofilled.`);
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
            await api.put(`/leads/${id}`, payload);
            router.push(`/admin/leads/${id}`);
        } catch (error: any) {
            console.error("Failed to update lead", error);
            alert(`Failed to update lead: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-8 text-center text-slate-500">Loading Lead details...</div>;

    return (
        <div className="space-y-6">
            <PageHeader title="Edit Lead" description="Modify details for this lead pipeline entry." />

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Client Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
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
                                        <input name="referralId" value={formData.referralId} className="w-full h-10 rounded-md border border-orange-200 px-3 bg-white" onChange={handleChange} placeholder="Partner ID or Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-orange-800">Referrer Email</label>
                                        <input name="referralEmail" type="email" value={formData.referralEmail} className="w-full h-10 rounded-md border border-orange-200 px-3 bg-white" onChange={handleChange} placeholder="partner@example.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-orange-800">Commission (%)</label>
                                        <input name="referralPercentage" type="number" min="0" max="100" value={formData.referralPercentage} className="w-full h-10 rounded-md border border-orange-200 px-3 bg-white" onChange={handleChange} />
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Contact Name *</label>
                                    <input name="name" value={formData.name} required className="w-full h-10 rounded-md border border-slate-300 px-3" onChange={handleChange} placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Company Name</label>
                                    <input name="companyName" value={formData.companyName} className="w-full h-10 rounded-md border border-slate-300 px-3" onChange={handleChange} placeholder="Acme Corp" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <input name="email" value={formData.email} type="email" className="w-full h-10 rounded-md border border-slate-300 px-3" onChange={handleChange} placeholder="john@example.com" />
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
                                <select multiple name="serviceInterest" value={formData.serviceInterest} className="w-full h-32 rounded-md border border-slate-300 px-3 bg-white" onChange={handleMultiSelect}>
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
                                    <a href="/admin/users/invite" target="_blank" className="text-xs text-blue-600 hover:underline">
                                        Assign new role to staff
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
                                <textarea name="internalNotes" value={formData.internalNotes} className="w-full h-24 rounded-md border border-slate-300 p-3 bg-white" onChange={handleChange} />
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
                        <Button type="submit" isLoading={loading} className="w-full">Save Changes</Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
