'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { PageHeader } from '@/components/os/ui/PageHeader';
import { Button } from '@/components/os/ui/Button';
import { Plus, Pencil, Trash2, Copy, Eye, Mail, DollarSign, Filter, X } from 'lucide-react';
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

export default function QuotesPage() {
    const [allQuotes, setAllQuotes] = useState<any[]>([]);
    const [filteredQuotes, setFilteredQuotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        fetchQuotes();
    }, []);

    useEffect(() => {
        let res = allQuotes;

        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            res = res.filter(q =>
                (q.quotationId || q.quoteNumber || '').toLowerCase().includes(lower) ||
                (q.leadId?.name || '').toLowerCase().includes(lower) ||
                (q.leadId?.email || '').toLowerCase().includes(lower) ||
                (q.grandTotal?.toString() || '').includes(lower)
            );
        }

        if (statusFilter !== 'ALL') {
            res = res.filter(q => q.status === statusFilter);
        }

        setFilteredQuotes(res);
    }, [searchTerm, statusFilter, allQuotes]);

    const fetchQuotes = async () => {
        try {
            const res = await api.get('/quotes');
            setAllQuotes(res.data);
            setFilteredQuotes(res.data);
        } catch (error) {
            console.error("Failed to fetch quotes", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this quote? This will also unlink it from the lead.')) {
            try {
                await api.delete(`/quotes/${id}`);
                setAllQuotes(prev => prev.filter(q => q._id !== id));
            } catch (error) {
                console.error("Failed to delete quote", error);
                alert("Failed to delete quote");
            }
        }
    };

    if (loading) return <div className="p-8">Loading quotes...</div>;

    return (
        <div className="space-y-6">
            <PageHeader title="Quotations" description="Manage all sent quotations">
                <Link href="/admin/quotes/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Quote
                    </Button>
                </Link>
            </PageHeader>

            <div className="bg-white p-4 rounded-xl border border-structura-border shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-4 w-full md:w-auto flex-1">
                    <div className="relative flex-1 max-w-md">
                        <input
                            placeholder="Search by Quote #, Customer, Amount..."
                            className="w-full h-10 rounded-md border border-slate-300 pl-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    <select
                        className="h-10 rounded-md border border-slate-300 bg-white px-3 focus:ring-2 focus:ring-blue-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
                <div className="text-sm text-slate-500 font-medium">
                    Showing {filteredQuotes.length} results
                </div>
            </div>

            <div className="bg-white rounded-xl border border-structura-border overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Quote #</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredQuotes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <Filter className="h-8 w-8 text-slate-300" />
                                        <p>No quotations found matching your filters.</p>
                                        <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }}>Clear Filters</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredQuotes.map((quote) => (
                                <TableRow key={quote._id} className="hover:bg-slate-50 transition-colors">
                                    <TableCell className="font-medium text-slate-900">
                                        {quote.quotationId || quote.quoteNumber || quote._id.substring(quote._id.length - 6).toUpperCase()}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{quote.leadId?.name || 'Unknown Lead'}</div>
                                    </TableCell>
                                    <TableCell>{new Date(quote.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="font-momo font-medium">
                                        {quote.currency || 'INR'} {quote.grandTotal?.toLocaleString() || quote.amount?.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={quote.status} />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* Send Email */}
                                            {['draft', 'sent'].includes(quote.status) && (
                                                <Button
                                                    variant="outline" size="sm"
                                                    onClick={async () => {
                                                        if (confirm(`Send quote to ${quote.leadId?.email || 'lead'} with acceptance link?`)) {
                                                            try {
                                                                await api.post(`/quotes/${quote._id}/send`);
                                                                alert('Quote sent successfully!');
                                                                fetchQuotes();
                                                            } catch (error: any) {
                                                                console.error(error);
                                                                alert(error.response?.data?.message || 'Failed to send email');
                                                            }
                                                        }
                                                    }}
                                                    className="border-slate-200 text-slate-600 hover:text-orange-600 hover:bg-orange-50 px-3"
                                                >
                                                    <Mail className="h-4 w-4 mr-2" /> Send
                                                </Button>
                                            )}

                                            <Button
                                                variant="outline" size="sm"
                                                onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}/quotes/${quote._id}/pdf`, '_blank')}
                                                className="border-slate-200 text-slate-600 hover:text-purple-600 hover:bg-purple-50 px-3"
                                            >
                                                <Eye className="h-4 w-4 mr-2" /> View PDF
                                            </Button>

                                            {['draft'].includes(quote.status) && (
                                                <Link href={`/admin/quotes/${quote._id}/edit`}>
                                                    <Button variant="outline" size="sm" className="border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-3">
                                                        <Pencil className="h-4 w-4 mr-2" /> Edit
                                                    </Button>
                                                </Link>
                                            )}

                                            {['sent', 'accepted', 'rejected'].includes(quote.status) && (
                                                <Button
                                                    variant="outline" size="sm"
                                                    className="border-slate-200 text-slate-600 px-3 hover:text-indigo-600 hover:bg-indigo-50"
                                                    onClick={async () => {
                                                        if (confirm('Create a new Revision for this quotation? The current one will be archived.')) {
                                                            try {
                                                                const res = await api.post(`/quotes/${quote._id}/revise`, {});
                                                                router.push(`/admin/quotes/${res.data._id}/edit`);
                                                            } catch (err: any) {
                                                                alert(err.response?.data?.message || 'Failed to revise');
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <Copy className="h-3.5 w-3.5 mr-2" /> Revise
                                                </Button>
                                            )}

                                            <div className="w-[1px] h-4 bg-slate-200 mx-1"></div>

                                            {quote.status !== 'accepted' && (
                                                <Button
                                                    variant="outline" size="sm"
                                                    onClick={() => handleDelete(quote._id)}
                                                    className="border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 px-3"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                                </Button>
                                            )}
                                        </div>
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
