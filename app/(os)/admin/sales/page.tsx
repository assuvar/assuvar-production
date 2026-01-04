'use client';

import Link from "next/link";
import { Plus, Search, Filter, FileText, CheckCircle, Clock } from "lucide-react";
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

    return (
        <div className="space-y-6">
            <PageHeader
                title="Sales & Revenue"
                description="Manage your revenue pipeline."
            />

            <Card className="p-0">
                <div className="flex items-center justify-between p-4 border-b border-structura-border bg-white rounded-t-xl">
                    <div className="relative w-72">
                        {/* Search placeholder */}
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search sales..." className="h-10 w-full rounded-lg border border-structura-border pl-10 pr-4 text-sm" />
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sale ID</TableHead>
                            <TableHead>Client Ref</TableHead>
                            <TableHead>Lead</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Paid</TableHead>
                            <TableHead>Pending</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-4">Loading...</TableCell></TableRow>
                        ) : sales.length === 0 ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-4">No sales found.</TableCell></TableRow>
                        ) : (
                            sales.map((sale) => (
                                <TableRow key={sale._id} className="cursor-pointer hover:bg-slate-50">
                                    <TableCell className="font-medium text-structura-black">
                                        <Link href={`/admin/sales/${sale._id}`} className="hover:text-structura-blue hover:underline">
                                            {sale.saleNumber || sale._id.substring(sales.length - 6)}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="font-medium text-slate-600">
                                        {sale.clientReference || 'N/A'}
                                    </TableCell>
                                    <TableCell className="font-medium text-structura-black">
                                        {sale.quoteId?.leadId?.name || 'Unknown'}
                                    </TableCell>
                                    <TableCell>{sale.currency || sale.quoteId?.currency || '$'} {sale.totalAmount}</TableCell>
                                    <TableCell className="text-green-600">{sale.currency || sale.quoteId?.currency || '$'} {sale.paidAmount}</TableCell>
                                    <TableCell className="text-red-500 font-bold">{sale.currency || sale.quoteId?.currency || '$'} {sale.pendingAmount}</TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/admin/sales/${sale._id}`}>
                                            <Button variant="ghost" size="sm">View</Button>
                                        </Link>
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
