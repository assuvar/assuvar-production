'use client';

import Link from "next/link";
import * as XLSX from 'xlsx';
import { Plus, Search, Filter, FileText, ReceiptText, CheckCircle, Clock, Mail, Eye as View, Download, Check } from "lucide-react";
import { PageHeader } from "@/components/os/ui/PageHeader";
import { Button } from "@/components/os/ui/Button";
import { Card } from "@/components/os/ui/Card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/os/ui/Table";
import { StatusBadge } from "@/components/os/ui/StatusBadge";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { cn, formatDate } from "@/lib/utils";

export default function SalesPage() {
    const [sales, setSales] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSales, setSelectedSales] = useState<string[]>([]);

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

    const handleSelectSale = (id: string) => {
        setSelectedSales(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedSales.length === displaySales.length && displaySales.length > 0) {
            setSelectedSales([]);
        } else {
            setSelectedSales(displaySales.map(s => s._id));
        }
    };

    const exportToExcel = (mode: 'selected' | 'filtered') => {
        const dataToExport = mode === 'selected'
            ? sales.filter(s => selectedSales.includes(s._id))
            : displaySales;

        if (dataToExport.length === 0) return alert("No sales to export.");

        const worksheetData = dataToExport.map(s => ({
            'Sale ID': s.saleId || 'N/A',
            'Client Ref': s.clientReference || 'N/A',
            'Linked Quote': s.quoteId?.quotationId || 'Unknown',
            'Total Amount': s.totalAmount,
            'Paid Amount': s.paidAmount,
            'Pending Amount': s.pendingAmount,
            'Currency': s.currency || s.quoteId?.currency || '$',
            'Payment Status': s.paymentStatus,
            'Created At': s.createdAt ? new Date(s.createdAt).toLocaleString() : 'N/A'
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sales");

        const wscols = [
            { wch: 15 }, { wch: 25 }, { wch: 20 }, { wch: 15 },
            { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 20 }
        ];
        worksheet['!cols'] = wscols;

        XLSX.writeFile(workbook, `sales_export_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Sales & Revenue"
                description="Manage your revenue pipeline, invoices, and payment statuses."
            >
                <Button variant="outline" onClick={() => exportToExcel('filtered')}>
                    <Download className="mr-2 h-4 w-4 text-structura-blue" /> Export All
                </Button>
            </PageHeader>

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
                            <TableHead className="w-12">
                                <div className="flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-slate-300 text-structura-blue focus:ring-structura-blue cursor-pointer"
                                        checked={selectedSales.length === displaySales.length && displaySales.length > 0}
                                        onChange={handleSelectAll}
                                    />
                                </div>
                            </TableHead>
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
                        ) : (
                            displaySales.length === 0 ? (
                                <TableRow><TableCell colSpan={8} className="text-center py-4">No sales found.</TableCell></TableRow>
                            ) : (
                                displaySales.map((sale) => (
                                    <TableRow
                                        key={sale._id}
                                        className={cn(
                                            "cursor-pointer hover:bg-slate-50",
                                            selectedSales.includes(sale._id) && "bg-blue-50/50"
                                        )}
                                        onClick={() => handleSelectSale(sale._id)}
                                    >
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-slate-300 text-structura-blue focus:ring-structura-blue cursor-pointer"
                                                    checked={selectedSales.includes(sale._id)}
                                                    onChange={() => handleSelectSale(sale._id)}
                                                />
                                            </div>
                                        </TableCell>
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
                                                    disabled={sale.paymentStatus !== 'paid'}
                                                    title="Email Final Invoice"
                                                >
                                                    <Mail className="h-4 w-4" />
                                                </Button>

                                                <Button
                                                    variant="outline" size="sm" title="Final Invoice"
                                                    onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}/sales/${sale._id}/invoice`, '_blank')}
                                                    className="text-slate-600 hover:text-purple-600 hover:bg-purple-50 px-2"
                                                    disabled={sale.paymentStatus !== 'paid'}
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
                            )
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Bulk Actions Floating Bar */}
            {selectedSales.length > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-structura-black text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 border border-slate-700/50 backdrop-blur-md">
                        <div className="flex items-center gap-2 border-r border-slate-700 pr-6">
                            <div className="bg-structura-blue p-1.5 rounded-lg">
                                <Check className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-bold">{selectedSales.length} Selected</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-200 hover:text-white hover:bg-white/10"
                                onClick={() => setSelectedSales([])}
                            >
                                Clear Selection
                            </Button>
                            <Button
                                size="sm"
                                className="bg-structura-blue hover:bg-blue-600 text-white"
                                onClick={() => exportToExcel('selected')}
                            >
                                <Download className="mr-2 h-4 w-4" /> Export Selected
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
