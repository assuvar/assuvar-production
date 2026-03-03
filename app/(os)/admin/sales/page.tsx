'use client';

import Link from "next/link";
import { Plus, Search, Filter, FileText, CheckCircle, Clock, Mail, Eye } from "lucide-react";
import { PageHeader } from "@/components/os/ui/PageHeader";
import { Button } from "@/components/os/ui/Button";
import { Card } from "@/components/os/ui/Card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/os/ui/Table";
import { StatusBadge } from "@/components/os/ui/StatusBadge";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function SalesPage() {
    const [sales, setSales] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const res = await api.get('/sales');
            setSales(res.data);
        } catch (error) {
            console.error("Failed to fetch sales", error);
        } finally {
            setLoading(false);
        }
    };

    const displaySales = sales.filter(s =>
        (s.saleId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.clientReference || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Sales & Revenue"
                description="Manage your revenue pipeline, invoices, and payment statuses."
            />

            <Card className="p-0">
                <div className="flex items-center justify-between p-4 border-b border-structura-border bg-white rounded-t-xl">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search sales..."
                            className="h-10 w-full rounded-lg border border-structura-border pl-10 pr-4 text-sm"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sale ID</TableHead>
                            <TableHead>Client Ref</TableHead>
                            <TableHead>Linked Quote</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Paid</TableHead>
                            <TableHead>Pending</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={8} className="text-center py-4">Loading...</TableCell></TableRow>
                        ) : displaySales.length === 0 ? (
                            <TableRow><TableCell colSpan={8} className="text-center py-4">No sales found.</TableCell></TableRow>
                        ) : (
                            displaySales.map((sale) => (
                                <TableRow key={sale._id} className="cursor-pointer hover:bg-slate-50">
                                    <TableCell className="font-medium text-structura-black">
                                        <Link href={`/admin/sales/${sale._id}`} className="hover:text-structura-blue hover:underline">
                                            {sale.saleId || sale._id.substring(sale._id.length - 6).toUpperCase()}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="font-medium text-slate-600">
                                        {sale.clientReference || 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-sm text-slate-500">
                                        {sale.quoteId?.quotationId || 'Unknown'}
                                    </TableCell>
                                    <TableCell className="font-medium">{sale.currency || sale.quoteId?.currency || '$'} {sale.totalAmount.toLocaleString()}</TableCell>
                                    <TableCell className="text-green-600 font-medium">{sale.currency || sale.quoteId?.currency || '$'} {sale.paidAmount.toLocaleString()}</TableCell>
                                    <TableCell className="text-red-500 font-bold">{sale.currency || sale.quoteId?.currency || '$'} {sale.pendingAmount.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <StatusBadge status={sale.paymentStatus} />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="outline" size="sm"
                                                onClick={async () => {
                                                    if (confirm('Send Invoice email?')) {
                                                        try {
                                                            await api.post(`/sales/${sale._id}/send`);
                                                            alert('Invoice sent successfully!');
                                                        } catch (err) {
                                                            alert('Failed to send invoice');
                                                        }
                                                    }
                                                }}
                                                className="text-slate-600 hover:text-orange-600 hover:bg-orange-50 px-2"
                                            >
                                                <Mail className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                variant="outline" size="sm"
                                                onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}/sales/${sale._id}/invoice`, '_blank')}
                                                className="text-slate-600 hover:text-purple-600 hover:bg-purple-50 px-2"
                                            >
                                                <FileText className="h-4 w-4" />
                                            </Button>

                                            <Link href={`/admin/sales/${sale._id}`}>
                                                <Button variant="outline" size="sm" className="px-3">Manage</Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
