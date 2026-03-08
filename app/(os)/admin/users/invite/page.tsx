'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageHeader } from "@/components/os/ui/PageHeader";
import { Card, CardContent } from "@/components/os/ui/Card";
import { Button } from "@/components/os/ui/Button";
import { Input } from "@/components/os/ui/Input";
import { ShieldCheck, Search, Send, UserPlus, Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/os/ui/Table";
import axios from 'axios';
import { toast } from 'sonner';

const roles = [
    { id: 'client', label: 'Client' },
    { id: 'employee', label: 'Employee' },
];

export default function InviteUserPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialRole = searchParams.get('role') || 'client';

    const [selectedRole, setSelectedRole] = useState(initialRole);
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState<any[]>([]);
    const [fetchingClients, setFetchingClients] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        if (selectedRole === 'client') {
            fetchClients();
        }
    }, [selectedRole]);

    const fetchClients = async () => {
        setFetchingClients(true);
        try {
            const res = await axios.get('/api/proxy/clients');
            setClients(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch clients list.");
        } finally {
            setFetchingClients(false);
        }
    };

    const handleRoleChange = (role: string) => {
        setSelectedRole(role);
        setFormData({});
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleInviteClient = async (clientId: string) => {
        setLoading(true);
        try {
            await axios.post('/api/proxy/admin/invite', {
                role: 'client',
                existingClientProfileId: clientId
            });
            toast.success("Invitation sent successfully!");
            fetchClients(); // Refresh to show status update
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to send invite.');
        } finally {
            setLoading(false);
        }
    };

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/proxy/admin/invite', {
                role: selectedRole,
                ...formData
            });
            toast.success(`Success! Invitation sent.`);
            setFormData({});
            if (selectedRole === 'client') fetchClients();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to send invite.');
        } finally {
            setLoading(false);
        }
    };

    const filteredClients = clients.filter(c =>
        c.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.clientId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <PageHeader
                title="Invite New User"
                description="Grant portal access to clients or staff members with secure credentials."
            />

            <Card className="overflow-hidden border-structura-border shadow-sm">
                <CardContent className="p-0">
                    <div className="flex border-b bg-slate-50/50">
                        {roles.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => handleRoleChange(role.id)}
                                className={`px-8 py-4 font-bold text-sm transition-all relative ${selectedRole === role.id
                                    ? 'text-structura-blue bg-white border-b-2 border-structura-blue shadow-[0_4px_10px_-4px_rgba(59,130,246,0.2)]'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    {role.id === 'client' ? <Users className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                                    {role.label}s
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {selectedRole === 'client' ? (
                            <div className="space-y-6">
                                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className="relative w-full md:w-96">
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            placeholder="Search by ID, Company or Email..."
                                            className="pl-10 bg-white"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <div className="text-xs text-slate-500 font-medium">
                                        Showing {filteredClients.length} of {clients.length} registered clients
                                    </div>
                                </div>

                                <div className="rounded-xl border border-structura-border overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-slate-50/50">
                                            <TableRow>
                                                <TableHead className="w-24">ID</TableHead>
                                                <TableHead>Client Details</TableHead>
                                                <TableHead>Contact Email</TableHead>
                                                <TableHead>Portal Access</TableHead>
                                                <TableHead className="text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {fetchingClients ? (
                                                <TableRow><TableCell colSpan={5} className="text-center py-10 text-slate-400">Loading clients...</TableCell></TableRow>
                                            ) : filteredClients.length === 0 ? (
                                                <TableRow><TableCell colSpan={5} className="text-center py-10 text-slate-400">No clients found matching your search.</TableCell></TableRow>
                                            ) : (
                                                filteredClients.map((client) => (
                                                    <TableRow key={client._id} className="hover:bg-slate-50/50 transition-colors">
                                                        <TableCell className="font-mono text-[11px] font-bold text-structura-blue uppercase tracking-tight">
                                                            {client.clientId || '—'}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="font-bold text-structura-black text-sm">{client.companyName}</div>
                                                            <div className="text-xs text-slate-500">{client.contactPerson}</div>
                                                        </TableCell>
                                                        <TableCell className="text-xs text-slate-600 font-medium">{client.email}</TableCell>
                                                        <TableCell>
                                                            {client.userId ? (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wider border border-green-200">
                                                                    Enabled
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-wider border border-slate-200">
                                                                    Inactive
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleInviteClient(client._id)}
                                                                disabled={loading || client.userId}
                                                                className={client.userId ? 'bg-slate-100 text-slate-400 border-none' : 'btn-fusion'}
                                                            >
                                                                {client.userId ? 'Already Invited' : <><Send className="h-3 w-3 mr-1.5" /> Send Invite</>}
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleManualSubmit} className="max-w-2xl mx-auto space-y-6 py-4">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                                            <Input name="fullName" placeholder="Enter employee full name" required onChange={handleChange} value={formData.fullName || ''} className="h-11 border-slate-200" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Official Email</label>
                                            <Input name="officialEmail" type="email" placeholder="example@assuvar.in" required onChange={handleChange} value={formData.officialEmail || ''} className="h-11 border-slate-200" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Designation</label>
                                            <select
                                                name="designation"
                                                required
                                                onChange={(e: any) => setFormData({ ...formData, designation: e.target.value })}
                                                value={formData.designation || ''}
                                                className="flex h-11 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-structura-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <option value="" disabled>Select Designation</option>
                                                <option value="Employee">Employee</option>
                                                <option value="Manager">Manager</option>
                                                <option value="Sales Staff">Sales Staff</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Number</label>
                                            <Input name="mobileNumber" placeholder="+91 XXXXX XXXXX" required onChange={handleChange} value={formData.mobileNumber || ''} className="h-11 border-slate-200" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date of Birth</label>
                                            <Input name="dateOfBirth" type="date" required onChange={handleChange} value={formData.dateOfBirth || ''} className="h-11 border-slate-200" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Joining Date</label>
                                            <Input name="joiningDate" type="date" required onChange={handleChange} value={formData.joiningDate || ''} className="h-11 border-slate-200" />
                                        </div>
                                    </div>

                                    <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
                                        <ShieldCheck className="h-5 w-5 text-structura-blue mt-0.5" />
                                        <div>
                                            <div className="text-sm font-bold text-structura-blue">Auto-Generated ID</div>
                                            <p className="text-xs text-slate-500 font-medium">Employee ID (ASE-XXXX) will be automatically generated upon submission.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center pt-4">
                                    <Button type="submit" disabled={loading} className="w-full btn-fusion h-12 text-base shadow-lg shadow-structura-blue/20">
                                        {loading ? 'Sending Invites...' : <><UserPlus className="h-5 w-5 mr-2" /> Invite Staff Member</>}
                                    </Button>
                                    <Button type="button" variant="ghost" onClick={() => router.back()} disabled={loading} className="ml-4 h-12 px-8">
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-structura-blue shadow-sm bg-blue-50/10">
                <CardContent className="p-6">
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-structura-black">
                        <ShieldCheck className="h-5 w-5 text-structura-blue" />
                        Access Control & Permissions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="space-y-3">
                            <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                                <div className="font-bold text-blue-700 mb-1">Employee / Sales</div>
                                <p className="text-slate-600 text-xs leading-relaxed">Access to CRM, Lead Management, and Quoting tools. Restricted from deletion and payment verification.</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                                <div className="font-bold text-green-700 mb-1">Client Portal</div>
                                <p className="text-slate-600 text-xs leading-relaxed">Restricted view of their own projects, invoices, and documents. No access to the main administrative OS.</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

