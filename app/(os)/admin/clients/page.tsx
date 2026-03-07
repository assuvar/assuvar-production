'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { PageHeader } from '@/components/os/ui/PageHeader';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/os/ui/Table';
import { Button } from '@/components/os/ui/Button';
import { StatusBadge } from '@/components/os/ui/StatusBadge';
import { Settings, UserPlus, Users } from 'lucide-react';
import Link from 'next/link';

export default function ClientsPage() {
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchClients(); }, []);

    const fetchClients = async () => {
        try {
            const res = await api.get('/clients');
            setClients(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-slate-500">Loading clients...</div>;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Clients"
                description="Clients are automatically registered when an advance receipt is generated."
            />

            <div className="bg-white rounded-xl border border-structura-border overflow-hidden shadow-sm">
                {clients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center text-slate-400">
                        <Users className="h-12 w-12 mb-4 text-slate-200" />
                        <p className="text-sm font-semibold text-slate-500">No clients yet</p>
                        <p className="text-xs mt-1 text-slate-400 max-w-xs">
                            Clients are registered automatically once an advance receipt is generated from a Sale.
                        </p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Client ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clients.map((client) => (
                                <TableRow key={client._id}>
                                    <TableCell>
                                        <span className="font-mono text-xs font-bold text-structura-blue bg-blue-50 px-2 py-1 rounded">
                                            {client.clientId || '—'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-semibold text-structura-black">
                                        {client.contactPerson}
                                        {client.companyName && client.companyName !== client.contactPerson && (
                                            <p className="text-xs text-slate-400 font-normal">{client.companyName}</p>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-slate-600">{client.email}</TableCell>
                                    <TableCell className="text-slate-500">{client.phone || '—'}</TableCell>
                                    <TableCell>
                                        {client.userId ? (
                                            <StatusBadge status="Invited" type="success" />
                                        ) : (
                                            <StatusBadge status="Active" type="neutral" />
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/clients/${client._id}`}>
                                                <Button variant="outline" size="sm" className="text-slate-700">
                                                    <Settings className="h-3.5 w-3.5 mr-1.5" />
                                                    Manage
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/users/invite?role=client&email=${encodeURIComponent(client.email)}`}>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                                >
                                                    <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                                                    {client.userId ? 'Re-invite' : 'Invite'}
                                                </Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}
