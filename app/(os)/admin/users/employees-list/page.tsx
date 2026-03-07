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

export default function EmployeesListPage() {
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const { data } = await axios.get('/api/proxy/admin/employees');
            setEmployees(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (employee: any) => {
        setSelectedEmployee(employee);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this employee? This will also delete their login account.')) return;

        try {
            await axios.delete(`/api/proxy/admin/employees/${id}`);
            toast.success('Employee deleted successfully');
            fetchEmployees();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to delete employee');
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
                title="Employee & Staffs"
                description="Manage and edit your internal team and staff members."
            />

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Full Name</TableHead>
                                <TableHead>Designation</TableHead>
                                <TableHead>ID</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employees.map((employee) => (
                                <TableRow key={employee._id}>
                                    <TableCell className="font-medium">{employee.fullName}</TableCell>
                                    <TableCell>{employee.designation}</TableCell>
                                    <TableCell>{employee.employeeId}</TableCell>
                                    <TableCell>
                                        <StatusBadge status={employee.userId?.status || 'unknown'} />
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-slate-500 hover:text-structura-blue"
                                            onClick={() => handleEdit(employee)}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-slate-500 hover:text-red-600"
                                            onClick={() => handleDelete(employee._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {employees.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                                        No employees found.
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
                onSuccess={fetchEmployees}
                user={selectedEmployee}
                role="employee"
            />
        </div>
    );
}
