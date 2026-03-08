'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import * as XLSX from 'xlsx';
import { PageHeader } from '@/components/os/ui/PageHeader';
import { Button } from '@/components/os/ui/Button';
import { Plus, Pencil, Trash2, Copy, Eye, Mail, Filter, Search, CheckCircle2, XCircle, RefreshCcw, Download, Check } from 'lucide-react';
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
import { useRouter } from 'next/navigation';
import { cn, formatDate } from '@/lib/utils';
import { Card } from '@/components/os/ui/Card';

const TABS = ['All', 'Drafts', 'Sent', 'Accepted', 'Rejected'];

export default function QuotesPage() {
    const [allQuotes, setAllQuotes] = useState<any[]>([]);
    const [filteredQuotes, setFilteredQuotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');
    const [selectedQuotes, setSelectedQuotes] = useState<string[]>([]);
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchQuotes();
    }, []);

    useEffect(() => {
        let res = allQuotes;

        // Status Filter Based on Tabs
        if (activeTab === 'Drafts') res = res.filter(q => q.status === 'draft');
        else if (activeTab === 'Sent') res = res.filter(q => q.status === 'sent');
        else if (activeTab === 'Accepted') res = res.filter(q => q.status === 'accepted');
        else if (activeTab === 'Rejected') res = res.filter(q => ['rejected', 'revision_requested'].includes(q.status));

        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            res = res.filter(q =>
                (q.quotationId || '').toLowerCase().includes(lower) ||
                (q.leadId?.name || '').toLowerCase().includes(lower) ||
                (q.leadId?.email || '').toLowerCase().includes(lower)
            );
        }

        setFilteredQuotes(res);
    }, [searchTerm, activeTab, allQuotes]);

    const fetchQuotes = async () => {
        try {
            const res = await api.get('/quotes');
            setAllQuotes(res.data);
        } catch (error) {
            console.error("Failed to fetch quotes", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: string, actionName: string) => {
        if (!confirm(`Are you sure you want to ${actionName} this quotation?`)) return;
        try {
            await api.patch(`/quotes/${id}/${action}`);
            fetchQuotes();
        } catch (error: any) {
            alert(error.response?.data?.message || `Failed to ${actionName}`);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you strictly sure? This delete is permanent.')) {
            try {
                await api.delete(`/quotes/${id}`);
                setAllQuotes(prev => prev.filter(q => q._id !== id));
            } catch (error) {
                console.error("Failed to delete", error);
                alert("Failed to delete quote");
            }
        }
    };

    const handleSelectQuote = (id: string) => {
        setSelectedQuotes(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedQuotes.length === filteredQuotes.length && filteredQuotes.length > 0) {
            setSelectedQuotes([]);
        } else {
            setSelectedQuotes(filteredQuotes.map(q => q._id));
        }
    };

    const exportToExcel = (mode: 'selected' | 'filtered') => {
        const dataToExport = mode === 'selected'
            ? allQuotes.filter(q => selectedQuotes.includes(q._id))
            : filteredQuotes;

        if (dataToExport.length === 0) return alert("No quotations to export.");

        const worksheetData = dataToExport.map(q => {
            const opCostsTotal = q.operationalCosts?.reduce((sum: number, c: any) => sum + (c.amount || 0), 0) || 0;
            const recurringTotal = (q.amcAmount || 0) + opCostsTotal;

            return {
                'Quote Number': q.quotationId || 'N/A',
                'Revision': `R${q.revisionNumber}`,
                'Company / Lead': q.leadId?.companyName || q.leadId?.name || 'N/A',
                'Email': q.leadId?.email || 'N/A',
                'Date': formatDate(q.createdAt),
                'One-time Amount': q.grandTotal,
                'AMC Amount': q.amcAmount || 0,
                'Operational Costs Total': opCostsTotal,
                'Annual Recurring Total': recurringTotal,
                'Currency': q.currency,
                'Status': q.status,
                'Converted to Sale': q.isConverted ? 'Yes' : 'No'
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Quotations");

        const wscols = [
            { wch: 15 }, { wch: 10 }, { wch: 25 }, { wch: 25 },
            { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 15 }
        ];
        worksheet['!cols'] = wscols;

        XLSX.writeFile(workbook, `quotations_export_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Quotations" description="Draft, send, and manage your service proposals.">
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => exportToExcel('filtered')}>
                        <Download className="mr-2 h-4 w-4 text-structura-blue" /> Export All
                    </Button>
                    <Link href="/admin/quotes/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Quote
                        </Button>
                    </Link>
                </div>
            </PageHeader>

            <div className="flex space-x-1 border-b border-slate-200">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                            activeTab === tab
                                ? "border-structura-blue text-structura-blue"
                                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                        )}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <Card className="p-0">
                <div className="flex flex-wrap items-center justify-between p-4 border-b border-structura-border bg-white rounded-t-xl gap-4">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search Quote #, Lead..."
                            className="h-10 w-full rounded-lg border border-structura-border pl-10 pr-4 text-sm focus:border-structura-blue focus:outline-none focus:ring-1 focus:ring-structura-blue"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="text-sm text-slate-500 font-medium">
                        Showing {filteredQuotes.length} active results
                    </div>
                </div>

                <div className="w-full overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <div className="flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-slate-300 text-structura-blue focus:ring-structura-blue cursor-pointer"
                                            checked={selectedQuotes.length === filteredQuotes.length && filteredQuotes.length > 0}
                                            onChange={handleSelectAll}
                                        />
                                    </div>
                                </TableHead>
                                <TableHead>Quote Number</TableHead>
                                <TableHead>Revision</TableHead>
                                <TableHead>Company / Lead</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={7} className="text-center py-10 text-slate-400">Loading data...</TableCell></TableRow>
                            ) : filteredQuotes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <Filter className="h-8 w-8 text-slate-300" />
                                            <p>No quotations found in "{activeTab}"</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredQuotes.map((quote) => (
                                    <TableRow
                                        key={quote._id}
                                        className={cn(
                                            "hover:bg-slate-50 transition-colors cursor-pointer",
                                            selectedQuotes.includes(quote._id) && "bg-blue-50/50"
                                        )}
                                        onClick={() => handleSelectQuote(quote._id)}
                                    >
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-slate-300 text-structura-blue focus:ring-structura-blue cursor-pointer"
                                                    checked={selectedQuotes.includes(quote._id)}
                                                    onChange={() => handleSelectQuote(quote._id)}
                                                />
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs font-bold text-slate-900">
                                            {quote.quotationId}
                                        </TableCell>
                                        <TableCell>
                                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-slate-600">R{quote.revisionNumber}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-bold text-[15px] text-structura-black">{quote.leadId?.companyName || quote.leadId?.name || 'Deleted Lead'}</div>
                                            <div className="text-xs text-slate-500 font-medium mt-0.5">{quote.leadId?.companyName ? quote.leadId?.name + " | " : ""}{quote.leadId?.email}</div>
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-500">{formatDate(quote.createdAt)}</TableCell>
                                        <TableCell className="font-bold text-blue-700">
                                            {quote.currency} {quote.grandTotal?.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <StatusBadge status={quote.status} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Accept/Reject (Staff Only) */}
                                                {['sent'].includes(quote.status) && (
                                                    <>
                                                        <Button size="sm" variant="outline" title="Accept Manually" className="h-8 border-emerald-200 text-emerald-600 hover:bg-emerald-50 px-2" onClick={() => handleAction(quote._id, 'accept', 'Accept')}>
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button size="sm" variant="outline" title="Reject Manually" className="h-8 border-red-200 text-red-600 hover:bg-red-50 px-2" onClick={() => handleAction(quote._id, 'reject', 'Reject')}>
                                                            <XCircle className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </>
                                                )}

                                                <Button
                                                    variant="outline" size="sm"
                                                    onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}/quotes/${quote._id}/pdf`, '_blank')}
                                                    className="h-8 border-slate-200 text-slate-600 hover:text-purple-600 hover:bg-purple-50 px-3"
                                                >
                                                    <Eye className="h-4 w-4 mr-2" /> View
                                                </Button>

                                                {['draft', 'sent'].includes(quote.status) && (
                                                    <Button
                                                        variant="outline" size="sm"
                                                        className="h-8 border-slate-200 text-slate-600 px-3 hover:text-blue-600 hover:bg-blue-50"
                                                        onClick={async () => {
                                                            if (confirm('Send this quotation to the client via email?')) {
                                                                try {
                                                                    await api.post(`/quotes/${quote._id}/send`);
                                                                    alert('Email sent successfully!');
                                                                    fetchQuotes();
                                                                } catch (err: any) {
                                                                    alert(err.response?.data?.message || 'Failed to send email');
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <Mail className="h-3.5 w-3.5 mr-2" /> Email Client
                                                    </Button>
                                                )}

                                                {['accepted'].includes(quote.status) && !quote.isConverted && (
                                                    <Button
                                                        variant="outline" size="sm"
                                                        className="h-8 border-emerald-200 text-emerald-700 font-bold px-3 hover:text-emerald-800 hover:bg-emerald-50 bg-emerald-50/50"
                                                        onClick={async () => {
                                                            if (confirm('Convert this quotation into an active Sale?')) {
                                                                try {
                                                                    await api.post(`/sales/convert`, { quoteId: quote._id });
                                                                    alert('Successfully converted to Sale! You can now view it under Sales.');
                                                                    // We keep it as accepted, just let them know it's done. 
                                                                    // If backend prevents multiple conversions, it will return an error correctly.
                                                                } catch (err: any) {
                                                                    alert(err.response?.data?.message || 'Failed to convert to Sale');
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <RefreshCcw className="h-3.5 w-3.5 mr-2" /> Convert to Sale
                                                    </Button>
                                                )}

                                                {['draft', 'sent', 'revision_requested'].includes(quote.status) && (
                                                    <Button
                                                        variant="outline" size="sm"
                                                        className={cn(
                                                            "h-8 px-3 transition-all",
                                                            quote.status === 'revision_requested'
                                                                ? "border-indigo-500 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-800 font-bold ring-1 ring-indigo-500/20"
                                                                : "border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
                                                        )}
                                                        onClick={async () => {
                                                            if (confirm('Create a new Revision? The current one will be archived.')) {
                                                                try {
                                                                    const res = await api.post(`/quotes/${quote._id}/revise`, {});
                                                                    router.push(`/admin/quotes/${res.data._id}/edit`);
                                                                } catch (err: any) {
                                                                    alert(err.response?.data?.message || 'Failed to revise');
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <Copy className={cn("h-3.5 w-3.5 mr-2", quote.status === 'revision_requested' && "animate-pulse")} />
                                                        {quote.status === 'revision_requested' ? 'Action Required: Revise' : 'Revise'}
                                                    </Button>
                                                )}

                                                <Button
                                                    variant="outline" size="sm"
                                                    disabled={!['draft', 'rejected'].includes(quote.status)}
                                                    onClick={() => handleDelete(quote._id)}
                                                    className={cn(
                                                        "h-8 border-slate-200 px-2 transition-colors",
                                                        !['draft', 'rejected'].includes(quote.status)
                                                            ? "text-slate-200 cursor-not-allowed"
                                                            : "text-slate-600 hover:text-red-600 hover:bg-red-50"
                                                    )}
                                                    title={['draft', 'rejected'].includes(quote.status) ? "Delete Quote" : "Only draft or rejected quotes can be deleted"}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>

            {/* Bulk Actions Floating Bar */}
            {selectedQuotes.length > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-4">
                    <div className="bg-structura-black text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 border border-slate-700/50 backdrop-blur-md">
                        <div className="flex items-center gap-2 border-r border-slate-700 pr-6">
                            <div className="bg-structura-blue p-1.5 rounded-lg">
                                <Check className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-bold">{selectedQuotes.length} Selected</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-200 hover:text-white hover:bg-white/10"
                                onClick={() => setSelectedQuotes([])}
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
                            <Button
                                size="sm"
                                variant="ghost"
                                disabled={allQuotes.some(q => selectedQuotes.includes(q._id) && !['draft', 'rejected'].includes(q.status))}
                                className={cn(
                                    "px-4 transition-colors",
                                    allQuotes.some(q => selectedQuotes.includes(q._id) && !['draft', 'rejected'].includes(q.status))
                                        ? "text-slate-600 cursor-not-allowed opacity-50"
                                        : "text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                )}
                                onClick={async () => {
                                    if (confirm(`Are you sure you want to delete ${selectedQuotes.length} quotations?`)) {
                                        try {
                                            await api.delete('/quotes/bulk', { data: { ids: selectedQuotes } });
                                            alert('Selected quotations deleted successfully!');
                                            setSelectedQuotes([]);
                                            fetchQuotes();
                                        } catch (err: any) {
                                            alert(err.response?.data?.message || 'Failed to delete quotations');
                                        }
                                    }
                                }}
                                title={allQuotes.some(q => selectedQuotes.includes(q._id) && !['draft', 'rejected'].includes(q.status)) ? "Only draft or rejected quotes can be deleted" : "Delete Selected"}
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
