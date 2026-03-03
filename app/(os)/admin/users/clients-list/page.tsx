'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/os/ui/PageHeader";
import { Card, CardContent } from "@/components/os/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/os/ui/Table";
import { Button } from "@/components/os/ui/Button";
import { StatusBadge } from "@/components/os/ui/StatusBadge";
import axios from 'axios';
import { Edit2, Loader2, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import UserEditModal from '@/components/os/users/UserEditModal';

export default function ClientsListPage() {
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<any>(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const { data } = await axios.get('/api/proxy/admin/clients');
            setClients(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch clients');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (client: any) => {
        setSelectedClient(client);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this client? This will also delete their login account.')) return;

        try {
            await axios.delete(`/api/proxy/admin/clients/${id}`);
            toast.success('Client deleted successfully');
            fetchClients();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to delete client');
        }
    };

    if (loading) return (
        <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-structura-blue" />
        </div>
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Added Clients"
                description="Manage and edit your invited client base."
            />

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Company Name</TableHead>
                                <TableHead>Contact Person</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clients.map((client) => (
                                <TableRow key={client._id}>
                                    <TableCell className="font-medium">{client.companyName}</TableCell>
                                    <TableCell>{client.contactPerson}</TableCell>
                                    <TableCell>{client.email}</TableCell>
                                    <TableCell>
                                        <StatusBadge status={client.userId?.status || 'unknown'} />
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-slate-500 hover:text-structura-blue"
                                            onClick={() => handleEdit(client)}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-slate-500 hover:text-red-600"
                                            onClick={() => handleDelete(client._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {clients.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                                        No clients found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <UserEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={fetchClients}
                user={selectedClient}
                role="client"
            />
        </div>
    );
}
