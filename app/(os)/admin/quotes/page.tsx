import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { PageHeader } from '@/components/os/ui/PageHeader';
import { Button } from '@/components/os/ui/Button';
import { Plus, Pencil, Trash2, Copy, Eye, Mail, Filter, Search, CheckCircle2, XCircle } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { Card } from '@/components/os/ui/Card';

const TABS = ['Drafts', 'Sent', 'Accepted', 'Rejected', 'All'];

export default function QuotesPage() {
    const [allQuotes, setAllQuotes] = useState<any[]>([]);
    const [filteredQuotes, setFilteredQuotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Drafts');
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
        else if (activeTab === 'Rejected') res = res.filter(q => q.status === 'rejected');

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

    return (
        <div className="space-y-6">
            <PageHeader title="Quotations" description="Draft, send, and manage your service proposals.">
                <Link href="/admin/quotes/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Quote
                    </Button>
                </Link>
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
                                <TableHead>Quote Number</TableHead>
                                <TableHead>Revision</TableHead>
                                <TableHead>Lead Name</TableHead>
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
                                    <TableRow key={quote._id} className="hover:bg-slate-50 transition-colors">
                                        <TableCell className="font-mono text-xs font-bold text-slate-900">
                                            {quote.quotationId}
                                        </TableCell>
                                        <TableCell>
                                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-slate-600">R{quote.revisionNumber}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{quote.leadId?.name || 'Deleted Lead'}</div>
                                            <div className="text-[10px] text-slate-400">{quote.leadId?.email}</div>
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-500">{new Date(quote.createdAt).toLocaleDateString()}</TableCell>
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
                                                        <Button size="sm" variant="outline" className="h-8 border-emerald-200 text-emerald-600 hover:bg-emerald-50 px-2" onClick={() => handleAction(quote._id, 'accept', 'Accept')}>
                                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button size="sm" variant="outline" className="h-8 border-red-200 text-red-600 hover:bg-red-50 px-2" onClick={() => handleAction(quote._id, 'reject', 'Reject')}>
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
                                                        className="h-8 border-slate-200 text-slate-600 px-3 hover:text-indigo-600 hover:bg-indigo-50"
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
                                                        <Copy className="h-3.5 w-3.5 mr-2" /> Revise
                                                    </Button>
                                                )}

                                                <Button
                                                    variant="outline" size="sm"
                                                    onClick={() => handleDelete(quote._id)}
                                                    className="h-8 border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 px-2"
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
        </div>
    );
}
