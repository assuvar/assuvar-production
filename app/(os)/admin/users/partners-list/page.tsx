'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from "@/components/os/ui/PageHeader";
import { Card, CardContent } from "@/components/os/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/os/ui/Table";
import { Button } from "@/components/os/ui/Button";
import { StatusBadge } from "@/components/os/ui/StatusBadge";
import axios from 'axios';
import { Edit2, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import UserEditModal from '@/components/os/users/UserEditModal';

export default function PartnersListPage() {
    const [partners, setPartners] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState<any>(null);

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            const { data } = await axios.get('/api/proxy/admin/partners');
            setPartners(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch partners');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (partner: any) => {
        setSelectedPartner(partner);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this partner? This will also delete their login account.')) return;

        try {
            await axios.delete(`/api/proxy/admin/partners/${id}`);
            toast.success('Partner deleted successfully');
            fetchPartners();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to delete partner');
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
                title="Added Partners"
                description="Manage and edit your invited business partners."
            />

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Company Name</TableHead>
                                <TableHead>Contact Person</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {partners.map((partner) => (
                                <TableRow key={partner._id}>
                                    <TableCell className="font-medium">{partner.companyName}</TableCell>
                                    <TableCell>{partner.contactPerson}</TableCell>
                                    <TableCell>{partner.partnershipType}</TableCell>
                                    <TableCell>
                                        <StatusBadge status={partner.userId?.status || 'unknown'} />
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-slate-500 hover:text-structura-blue"
                                            onClick={() => handleEdit(partner)}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-slate-500 hover:text-red-600"
                                            onClick={() => handleDelete(partner._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {partners.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                                        No partners found.
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
                onSuccess={fetchPartners}
                user={selectedPartner}
                role="partner"
            />
        </div>
    );
}
