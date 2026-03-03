'use client';

import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Building2, Briefcase } from 'lucide-react';
import { Button } from '@/components/os/ui/Button';
import api from '@/lib/axios';

const SERVICE_INTERESTS = [
    'Data Analytics', 'Product Engineering', 'Intelligent Automation',
    'Quality Engineering', 'Cloud and DevOps', 'AI Solutions', 'Consultancy'
];

const LEAD_SOURCES = [
    'Website', 'WhatsApp', 'Phone Call', 'Email',
    'Instagram', 'LinkedIn', 'Walk-in', 'Other'
];

interface AddLeadModalProps {
    onClose: () => void;
    onSuccess: (lead?: any) => void;
}

export function AddLeadModal({ onClose, onSuccess }: AddLeadModalProps) {
    const [loading, setLoading] = useState(false);
    const [staffList, setStaffList] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', country: '', companyName: '', industry: '',
        source: '', notes: '',
        serviceInterest: [] as string[],
        leadType: 'Inbound',
        assignedTo: '',
        referralId: '',
        referralEmail: '',
        referralPhone: '',
        referralPercentage: 0
    });

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await api.get('/users');
                setStaffList(res.data.filter((u: any) => u.role === 'admin' || u.role === 'employee'));
            } catch (err) {
                console.error("Could not fetch staff list", err);
            }
        };
        fetchStaff();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleServiceToggle = (service: string) => {
        setFormData(prev => {
            const current = [...prev.serviceInterest];
            if (current.includes(service)) {
                return { ...prev, serviceInterest: current.filter(s => s !== service) };
            } else {
                return { ...prev, serviceInterest: [...current, service] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Custom Validation for Referral
        if (formData.leadType === 'Referral') {
            if (!formData.referralEmail && !formData.referralPhone) {
                alert("Please provide either the Referrer Email or Referrer Phone number.");
                return;
            }
        }

        setLoading(true);
        try {
            const payload = { ...formData };
            if (!payload.assignedTo) delete (payload as any).assignedTo;
            const res = await api.post('/leads', payload);
            alert("Lead created successfully");
            onSuccess(res.data.lead);
        } catch (error: any) {
            console.error("Failed to create lead", error);
            alert(`Failed to create lead: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0 bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-bold">Add New Lead</h2>
                        <p className="text-sm text-slate-500">Manually enter a client into the pipeline.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    <form id="add-lead-form" onSubmit={handleSubmit} className="space-y-8">

                        {/* 1. System Settings */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">1. System Metadata</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Lead Type *</label>
                                    <select name="leadType" value={formData.leadType} required className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-structura-blue/20 focus:border-structura-blue appearance-none text-slate-600 shadow-sm" onChange={handleChange}>
                                        <option value="Inbound">Inbound</option>
                                        <option value="Outbound">Outbound</option>
                                        <option value="Referral">Referral</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Source</label>
                                    <select name="source" value={formData.source} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-structura-blue/20 focus:border-structura-blue appearance-none text-slate-600 shadow-sm" onChange={handleChange}>
                                        <option value="" disabled>Select Source (Optional)</option>
                                        {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Assigned Staff</label>
                                    <select name="assignedTo" value={formData.assignedTo} className="w-full px-4 py-2.5 bg-green-50/50 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-structura-blue/20 focus:border-structura-blue appearance-none text-slate-700 shadow-sm" onChange={handleChange}>
                                        <option value="">Unassigned</option>
                                        {staffList.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {formData.leadType === 'Referral' && (
                            <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl space-y-4">
                                <h3 className="text-sm font-bold text-orange-800 uppercase tracking-wider flex items-center gap-2"><User className="w-4 h-4" /> Referral Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-orange-900 block">Referrer Name / Partner ID</label>
                                        <input name="referralId" value={formData.referralId} className="w-full px-4 py-2.5 bg-white border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-sm" onChange={handleChange} placeholder="Partner Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-orange-900 block">Commission (%)</label>
                                        <input name="referralPercentage" type="number" min="0" max="100" value={formData.referralPercentage} className="w-full px-4 py-2.5 bg-white border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-sm" onChange={handleChange} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-orange-900 block">Referrer Email</label>
                                        <input name="referralEmail" type="email" value={formData.referralEmail} className="w-full px-4 py-2.5 bg-white border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-sm" onChange={handleChange} placeholder="partner@example.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-orange-900 block">Referrer Phone</label>
                                        <input name="referralPhone" type="tel" value={formData.referralPhone} className="w-full px-4 py-2.5 bg-white border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-sm" onChange={handleChange} placeholder="+1 234 567 8900" />
                                    </div>
                                </div>
                                <p className="text-xs text-orange-700 italic opacity-80 pl-1">* You must provide either an Email or a Phone Number for the referrer.</p>
                            </div>
                        )}

                        {/* 2. Mandatory Client Info */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">2. Pre-Requisite Client Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Full Name *</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input name="name" value={formData.name} required className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-structura-blue/20 focus:border-structura-blue shadow-sm" onChange={handleChange} placeholder="John Doe" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Business Email *</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input name="email" value={formData.email} type="email" required className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-structura-blue/20 focus:border-structura-blue shadow-sm" onChange={handleChange} placeholder="john@company.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Mobile Number *</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input name="phone" value={formData.phone} required className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-structura-blue/20 focus:border-structura-blue shadow-sm" onChange={handleChange} placeholder="+1 234 567 890" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Country / Location *</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input name="country" value={formData.country} required className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-structura-blue/20 focus:border-structura-blue shadow-sm" onChange={handleChange} placeholder="e.g. United States" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Company Name *</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input name="companyName" value={formData.companyName} required className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-structura-blue/20 focus:border-structura-blue shadow-sm" onChange={handleChange} placeholder="Acme Corp" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Industry *</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <select name="industry" value={formData.industry} required className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-structura-blue/20 focus:border-structura-blue appearance-none text-slate-600 shadow-sm" onChange={handleChange}>
                                            <option value="" disabled>Select Industry</option>
                                            <option value="Retail & Ecommerce">Retail & Ecommerce</option>
                                            <option value="Manufacturing">Manufacturing</option>
                                            <option value="Real Estate">Real Estate</option>
                                            <option value="Healthcare">Healthcare</option>
                                            <option value="Education">Education</option>
                                            <option value="Agency / Services">Agency / Services</option>
                                            <option value="Finance & Fintech">Finance & Fintech</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Deal Logistics */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">3. Project Profile</h3>

                            <div className="space-y-3 mb-6">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Service Category Needed</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {SERVICE_INTERESTS.map(service => (
                                        <label key={service} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors bg-white shadow-sm">
                                            <input
                                                type="checkbox"
                                                checked={formData.serviceInterest.includes(service)}
                                                onChange={() => handleServiceToggle(service)}
                                                className="w-4 h-4 rounded text-structura-blue focus:ring-structura-blue border-slate-300"
                                            />
                                            {service}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Initial Discovery Notes</label>
                                <textarea name="notes" rows={3} value={formData.notes} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-structura-blue/20 focus:border-structura-blue shadow-sm" placeholder="Any initial context or requirements..."></textarea>
                            </div>
                        </div>

                    </form>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 shrink-0">
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit" form="add-lead-form" disabled={loading}>
                        {loading ? 'Routing Lead...' : 'Initialize Lead pipeline'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
