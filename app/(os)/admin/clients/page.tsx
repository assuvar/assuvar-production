'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { PageHeader } from '@/components/os/ui/PageHeader';
import { Button } from '@/components/os/ui/Button';
import { Plus, Eye } from 'lucide-react';
import Link from 'next/link';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/os/ui/Table';
import { StatusBadge } from '@/components/os/ui/StatusBadge';

export default function ClientsPage() {
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClients();
    }, []);

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

    if (loading) return <div className="p-8">Loading clients...</div>;

    return (
        <div className="space-y-6">
            <PageHeader title="Client Database" description="Manage active clients and their profiles.">
                {/* Manual create optional, relying on automation mostly */}
            </PageHeader>

            <div className="bg-white rounded-xl border border-structura-border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client ID</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Contact Person</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                                    No clients found. Convert Leads to Sales to create clients automatically.
                                </TableCell>
                            </TableRow>
                        ) : (
                            clients.map((client) => (
                                <TableRow key={client._id}>
                                    <TableCell className="font-mono text-xs text-slate-500">
                                        {client.userId?.username || 'NO_ACCESS'}
                                    </TableCell>
                                    <TableCell className="font-medium text-structura-black">
                                        {client.companyName}
                                    </TableCell>
                                    <TableCell>{client.contactPerson}</TableCell>
                                    <TableCell>{client.email}</TableCell>
                                    <TableCell>
                                        <StatusBadge status={client.userId ? 'active' : 'pending'} type={client.userId ? 'success' : 'neutral'} />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/admin/clients/${client._id}`}>
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4 mr-2" />
                                                View Dashboard
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
