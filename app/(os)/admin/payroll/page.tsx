'use client';

import { useState, useEffect } from 'react';
import { Users, UserPlus, Mail, Shield, Clock, Search, Edit2, Trash2, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/os/ui/PageHeader';
import { Button } from '@/components/os/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/os/ui/Card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/os/ui/Table';
import { StatusBadge } from '@/components/os/ui/StatusBadge';
import { Input } from '@/components/os/ui/Input';
import api from '@/lib/axios';
import Link from 'next/link';
import { toast } from 'sonner';
import UserEditModal from '@/components/os/users/UserEditModal';
import Cookies from 'js-cookie';

export default function EmployeeStaffPage() {
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
    const [isManager, setIsManager] = useState(false);

    useEffect(() => {
        const info = Cookies.get('user_info');
        if (info) {
            try {
                const user = JSON.parse(info);
                if (user.role === 'employee' && user.designation === 'Manager') {
                    setIsManager(true);
                }
            } catch (e) { }
        }
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await api.get('/admin/employees');
            setEmployees(res.data);
        } catch (error) {
            console.error("Failed to fetch employees", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (employee: any) => {
        setSelectedEmployee(employee);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this employee & staff member? This will also delete their login account.')) return;

        try {
            await api.delete(`/admin/employees/${id}`);
            toast.success('Employee & Staff deleted successfully');
            fetchEmployees();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to delete employee & staff member');
        }
    };

    const filteredEmployees = employees.filter(emp =>
        emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-structura-blue"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Employee & Staffs"
                description="Manage your internal team and access levels."
            >
                <Link href="/admin/payroll/invite">
                    <Button className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" /> Invite Employee
                    </Button>
                </Link>
            </PageHeader>

            {employees.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center gap-4 max-w-sm">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search employees..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                                All Staff Members ({employees.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredEmployees.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                                                No employees match your search.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredEmployees.map((emp) => (
                                            <TableRow key={emp._id}>
                                                <TableCell className="font-semibold text-slate-900">{emp.name}</TableCell>
                                                <TableCell className="text-slate-600">{emp.userId?.email || emp.officialEmail || '-'}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1.5 text-slate-600">
                                                        <Shield className="h-3.5 w-3.5 text-indigo-500" />
                                                        {emp.designation || 'Staff'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge status={emp.userId?.status || 'Active'} />
                                                </TableCell>
                                                <TableCell className="text-slate-500 text-sm">
                                                    {emp.userId?.createdAt ? new Date(emp.userId.createdAt).toLocaleDateString() : 'N/A'}
                                                </TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-slate-500 hover:text-indigo-600"
                                                        onClick={() => handleEdit(emp)}
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-slate-500 hover:text-red-600"
                                                        onClick={() => handleDelete(emp._id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            )}

            <UserEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={fetchEmployees}
                user={selectedEmployee}
                role="employee"
            />
        </div>
    );
}

function EmptyState() {
    return (
        <Card className="border-dashed border-2 bg-slate-50/50">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-slate-100">
                    <Users className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Build your team</h3>
                <p className="text-slate-500 max-w-sm mb-8">
                    You haven't added any employees or staff members yet. Start by inviting your team via Access Control.
                </p>
                <div className="flex gap-4">
                    <Link href="/admin/users/invite">
                        <Button variant="primary" className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4" /> Invite via Access Control
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
