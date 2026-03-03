'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from "@/components/os/ui/PageHeader";
import { Card, CardContent } from "@/components/os/ui/Card";
import { Button } from "@/components/os/ui/Button"; // Check path
import { Input } from "@/components/os/ui/Input";   // Check path
import { ShieldCheck } from "lucide-react";
import axios from 'axios'; // Direct call to proxy

const roles = [
    { id: 'client', label: 'Client' },
    { id: 'employee', label: 'Employee' },
    { id: 'partner', label: 'Partner' },
];

export default function InviteUserPage() {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState('client');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState<any>({});

    const handleRoleChange = (role: string) => {
        setSelectedRole(role);
        setFormData({});
        setMessage('');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // Use Next.js Proxy to handle HttpOnly -> Bearer transition
            await axios.post('/api/proxy/admin/invite', {
                role: selectedRole,
                ...formData
            });
            setMessage(`Success! Invitation sent to ${formData.email || formData.officialEmail}.`);
            setFormData({});
        } catch (error: any) {
            console.error(error);
            setMessage(error.response?.data?.message || 'Failed to send invite.');
        } finally {
            setLoading(false);
        }
    };

    const renderForm = () => {
        switch (selectedRole) {
            case 'client':
                return (
                    <div className="space-y-4">
                        <Input name="companyName" placeholder="Company Name" required onChange={handleChange} value={formData.companyName || ''} />
                        <Input name="contactPerson" placeholder="Contact Person Name" required onChange={handleChange} value={formData.contactPerson || ''} />
                        <Input name="email" type="email" placeholder="Email Address" required onChange={handleChange} value={formData.email || ''} />
                        <Input name="phone" placeholder="Phone Number" onChange={handleChange} value={formData.phone || ''} />
                        <Input name="industry" placeholder="Industry" onChange={handleChange} value={formData.industry || ''} />
                        <Input name="address" placeholder="Address" onChange={handleChange} value={formData.address || ''} />
                    </div>
                );
            case 'employee':
                return (
                    <div className="space-y-4">
                        <Input name="fullName" placeholder="Full Name" required onChange={handleChange} value={formData.fullName || ''} />
                        <Input name="officialEmail" type="email" placeholder="Official Email (Login)" required onChange={handleChange} value={formData.officialEmail || ''} />
                        <Input name="designation" placeholder="Designation" required onChange={handleChange} value={formData.designation || ''} />
                        <Input name="department" placeholder="Department" required onChange={handleChange} value={formData.department || ''} />
                        <Input name="employeeId" placeholder="Employee ID" required onChange={handleChange} value={formData.employeeId || ''} />
                        <Input name="joiningDate" type="date" placeholder="Joining Date" required onChange={handleChange} value={formData.joiningDate || ''} />
                    </div>
                );
            case 'partner':
                return (
                    <div className="space-y-4">
                        <Input name="companyName" placeholder="Partner Company Name" required onChange={handleChange} value={formData.companyName || ''} />
                        <Input name="contactPerson" placeholder="Contact Person" required onChange={handleChange} value={formData.contactPerson || ''} />
                        <Input name="email" type="email" placeholder="Email Address" required onChange={handleChange} value={formData.email || ''} />
                        <Input name="partnershipType" placeholder="Partnership Type (e.g. Reseller)" required onChange={handleChange} value={formData.partnershipType || ''} />
                        <Input name="region" placeholder="Region" required onChange={handleChange} value={formData.region || ''} />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <PageHeader
                title="Invite New User"
                description="Send an automated email invitation with a secure verification code."
            />

            <Card>
                <CardContent className="p-6">
                    {/* Role Selector Tabs */}
                    <div className="flex border-b mb-6">
                        {roles.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => handleRoleChange(role.id)}
                                className={`px-4 py-2 font-medium text-sm transition-colors relative ${selectedRole === role.id
                                    ? 'text-structura-blue border-b-2 border-structura-blue'
                                    : 'text-slate-500 hover:text-structura-black'
                                    }`}
                            >
                                {role.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit}>
                        {renderForm()}

                        <div className="mt-6 flex justify-end gap-3">
                            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" disabled={loading} className="btn-fusion">
                                {loading ? 'Sending...' : 'Send Invitation'}
                            </Button>
                        </div>
                    </form>

                    {message && (
                        <div className={`mt-4 p-3 rounded text-sm ${message.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="mt-8 border-l-4 border-l-structura-blue shadow-sm">
                <CardContent className="p-6">
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-structura-black">
                        <ShieldCheck className="h-5 w-5 text-structura-blue" />
                        Access Control Rules & Permissions
                    </h3>
                    <div className="overflow-x-auto border border-slate-200 rounded-lg">
                        <table className="w-full text-sm text-left whitespace-nowrap lg:whitespace-normal">
                            <thead className="bg-slate-50 border-b text-slate-700">
                                <tr>
                                    <th className="p-3 font-semibold w-1/4">Role</th>
                                    <th className="p-3 font-semibold w-1/4">Access Level</th>
                                    <th className="p-3 font-semibold">Permissions & Restrictions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr>
                                    <td className="p-3 font-bold text-purple-700">Admin</td>
                                    <td className="p-3"><span className="px-2 py-1 bg-purple-100 text-purple-800 text-[10px] rounded uppercase font-bold tracking-wider">Full Access</span></td>
                                    <td className="p-3 leading-relaxed text-slate-600">Unrestricted access. Can manage users, assign roles, edit/delete leads, approve quotes, collect payments, and override pipeline statuses.</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-bold text-blue-700">Employee / Sales</td>
                                    <td className="p-3"><span className="px-2 py-1 bg-blue-100 text-blue-800 text-[10px] rounded uppercase font-bold tracking-wider">Operational (CRM)</span></td>
                                    <td className="p-3 leading-relaxed text-slate-600">Can view, create, and update Leads, Quotes, and Clients. <br /><strong className="text-red-500 font-medium">Restricted:</strong> Cannot delete records, edit accepted quotes, or verify payments.</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-bold text-green-700">Client</td>
                                    <td className="p-3"><span className="px-2 py-1 bg-green-100 text-green-800 text-[10px] rounded uppercase font-bold tracking-wider">Restricted Portal</span></td>
                                    <td className="p-3 leading-relaxed text-slate-600">Can only view their own projects, approved quotes, invoices, and documents via the Client Portal. No access to the Admin OS.</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-bold text-orange-700">Partner</td>
                                    <td className="p-3"><span className="px-2 py-1 bg-orange-100 text-orange-800 text-[10px] rounded uppercase font-bold tracking-wider">Affiliate Access</span></td>
                                    <td className="p-3 leading-relaxed text-slate-600">Can view leads submitted by them and track their commission payouts and status.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
