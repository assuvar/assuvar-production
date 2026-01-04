'use client';

import { useState } from 'react';
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
    // Consolidate loading logic
    const [loading, setLoading] = useState(false);
    const [lookupLoading, setLookupLoading] = useState(false);
    const [clientIdInput, setClientIdInput] = useState(''); // New optional input

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', source: '', notes: '',
        serviceInterest: [] as string[],
        companyName: '',
        budget: '', timeline: '', internalNotes: '', priority: 'Medium',
        existingClientId: '' // Hidden field
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleMultiSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const options = Array.from(e.target.selectedOptions, option => option.value);
        setFormData(prev => ({ ...prev, serviceInterest: options }));
    };

    // Lookup Logic
    const handleLookup = async (field: 'email' | 'clientId', value: string) => {
        if (!value) return;
        setLookupLoading(true);
        try {
            const payload = field === 'clientId' ? { clientId: value } : { email: value };
            const res = await api.post('/clients/lookup', payload);
            if (res.data) {
                const client = res.data;
                // Autofill
                setFormData(prev => ({
                    ...prev,
                    name: client.name,
                    email: client.email,
                    phone: client.phone || prev.phone,
                    companyName: client.companyName || prev.companyName,
                    existingClientId: client._id // Important: Link it!
                }));
                // Also sync the other lookup field if missing
                if (field === 'email' && !clientIdInput) setClientIdInput(client.clientId);
                if (field === 'clientId' && !formData.email) setFormData(prev => ({ ...prev, email: client.email }));

                alert(`Found Client: ${client.name}. Details autofilled.`);
            }
        } catch (error) {
            if (field === 'clientId') {
                console.warn("Client ID not found");
            }
        } finally {
            setLookupLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = { ...formData };
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
            <PageHeader
                title="Create New Lead"
                description="Manually add a new lead to the system."
            />

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Mandatory Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">

                            {/* NEW: Optional Client ID Lookup */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-purple-600">Existing Client ID (Optional)</label>
                                <input
                                    placeholder="e.g. ASV-CL-2512..."
                                    value={clientIdInput}
                                    onChange={(e) => setClientIdInput(e.target.value)}
                                    onBlur={(e) => handleLookup('clientId', e.target.value)}
                                    className="w-full h-10 rounded-md border border-purple-200 bg-purple-50 px-3 placeholder:text-purple-300"
                                />
                                <p className="text-xs text-slate-500">Enter ID to autofill details.</p>
                            </div>

                            <hr className="border-dashed border-slate-200 my-4" />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Client Name *</label>
                                    <input name="name" value={formData.name} required className="w-full h-10 rounded-md border border-slate-300 px-3" onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Source *</label>
                                    <select name="source" value={formData.source} required className="w-full h-10 rounded-md border border-slate-300 px-3 bg-white" onChange={handleChange}>
                                        <option value="">Select Source</option>
                                        {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email (Recommended)</label>
                                    <input name="email" value={formData.email} type="email" className="w-full h-10 rounded-md border border-slate-300 px-3" onChange={handleChange} onBlur={(e) => handleLookup('email', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone</label>
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        className="w-full h-10 rounded-md border border-slate-300 px-3"
                                        onChange={handleChange}
                                    />
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
                                    <select name="budget" className="w-full h-10 rounded-md border border-slate-300 px-3 bg-white" onChange={handleChange}>
                                        <option value="">Select Budget</option>
                                        {BUDGET_RANGES.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Timeline</label>
                                    <select name="timeline" className="w-full h-10 rounded-md border border-slate-300 px-3 bg-white" onChange={handleChange}>
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
                                <label className="text-sm font-medium">Priority</label>
                                <select name="priority" className="w-full h-10 rounded-md border border-slate-300 px-3 bg-white" onChange={handleChange}>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Internal Notes</label>
                                <textarea name="internalNotes" className="w-full h-24 rounded-md border border-slate-300 p-3" placeholder="Admin assigned, initial thoughts..." onChange={handleChange} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Client Message</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Original Message / Notes</label>
                                <textarea name="notes" className="w-full h-24 rounded-md border border-slate-300 p-3" onChange={handleChange} />
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
