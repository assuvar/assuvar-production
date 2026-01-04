'use client';

import { Building2, Mail, Phone, MapPin, FileText, DollarSign, Calendar, Clock, Tag, FileCheck } from 'lucide-react';
import { PageHeader } from '@/components/os/ui/PageHeader';
import { Button } from '@/components/os/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/os/ui/Card';
import { StatusBadge } from '@/components/os/ui/StatusBadge';
import { use, useEffect, useState } from 'react';
import api from '@/lib/axios';
import Link from 'next/link';

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [lead, setLead] = useState<any>(null);
    const [quotes, setQuotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            // Updated to use the new efficient single-lead endpoint
            const [leadRes, quotesRes] = await Promise.all([
                api.get(`/leads/${id}`),
                api.get('/quotes') // Ideally filter by leadId on backend, but filtering here for now
            ]);

            setLead(leadRes.data);
            setQuotes(quotesRes.data.filter((q: any) => q.leadId?._id === id || q.leadId === id));
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!lead) return <div>Lead not found</div>;

    const PriorityBadge = ({ priority }: { priority: string }) => {
        const colors: any = {
            High: 'bg-red-100 text-red-700 border-red-200',
            Medium: 'bg-amber-100 text-amber-700 border-amber-200',
            Low: 'bg-green-100 text-green-700 border-green-200',
        };
        const color = colors[priority] || 'bg-slate-100 text-slate-600';
        return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${color}`}>{priority || 'Medium'}</span>;
    };

    return (
        <div className="space-y-6">
            <PageHeader title={lead.name} description="Lead Details & Intelligence">
                <div className="flex gap-2">
                    {/* Conditional Primary Action */}
                    {['NEW', 'CONTACTED', 'REQUIREMENT GATHERING'].includes(lead.status) && (
                        <Link href={`/admin/quotes/create?leadId=${id}`}>
                            <Button>
                                <FileText className="mr-2 h-4 w-4" />
                                Create Quote
                            </Button>
                        </Link>
                    )}
                    {lead.status === 'QUOTED' && lead.quoteId && (
                        <Button
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={async () => {
                                if (confirm("Convert this quote to a confirmed Sale? This will mark the lead as WON.")) {
                                    try {
                                        await api.post('/sales/convert', { quoteId: lead.quoteId._id });
                                        fetchData(); // Refresh to show the new state
                                    } catch (err) {
                                        console.error(err);
                                        alert("Failed to convert");
                                    }
                                }
                            }}
                        >
                            <DollarSign className="mr-2 h-4 w-4" />
                            Convert to Sale
                        </Button>
                    )}
                </div>
            </PageHeader>

            {lead.existingClientId && (
                <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <div>
                        <span className="font-semibold">Existing Client Detected:</span> This lead is linked to an existing client account.
                        Conversion will associate the sale with the existing client.
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* LEFT COLUMN: Core Info */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 h-fit">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-2xl">
                            {lead.name.charAt(0)}
                        </div>
                        <div className="flex justify-between items-start w-full">
                            <div>
                                <h2 className="text-xl font-bold text-structura-black">{lead.name}</h2>
                                <div className="flex items-center gap-2 text-slate-500 mt-1">
                                    <span className="font-mono text-sm bg-slate-100 px-2 py-0.5 rounded border">{lead.leadId || lead._id}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <StatusBadge status={lead.status} />
                                <PriorityBadge priority={lead.priority} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <Mail className="h-4 w-4 text-slate-400" /> {lead.email || 'No email'}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <Phone className="h-4 w-4 text-slate-400" /> {lead.phone || 'No phone'}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <Building2 className="h-4 w-4 text-slate-400" /> {lead.source}
                        </div>
                    </div>
                </div>

                {/* MIDDLE COLUMN: Context & Requirements */}
                <div className="space-y-6 lg:col-span-2">

                    {/* Service Interest & Budget */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Requirements Context</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Service Interest</h4>
                                <div className="flex flex-wrap gap-2">
                                    {lead.serviceInterest && lead.serviceInterest.length > 0 ? (
                                        lead.serviceInterest.map((tag: string) => (
                                            <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100 flex items-center gap-1">
                                                <Tag className="w-3 h-3" /> {tag}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-slate-500 italic">No specific services selected.</span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-2 mb-1">
                                        <DollarSign className="w-4 h-4 text-slate-400" />
                                        <span className="text-xs font-bold text-slate-500 uppercase">Budget</span>
                                    </div>
                                    <p className="font-medium text-structura-black">{lead.budget || 'Not specified'}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        <span className="text-xs font-bold text-slate-500 uppercase">Timeline</span>
                                    </div>
                                    <p className="font-medium text-structura-black">{lead.timeline || 'Flexible'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Internal Notes */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Internal Notes</CardTitle></CardHeader>
                        <CardContent>
                            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 text-sm text-slate-700 whitespace-pre-wrap">
                                {lead.internalNotes || lead.notes || "No notes available."}
                            </div>
                            {/* Future: Add 'Edit Notes' button here */}
                        </CardContent>
                    </Card>

                    {/* Linked Records */}
                    <Card>
                        <CardHeader><CardTitle className="text-base">Linked History</CardTitle></CardHeader>
                        <CardContent>
                            {/* Documents & History */}
                            <div className="space-y-4">
                                {lead.quoteId ? (
                                    <div className="flex justify-between items-center p-3 border border-purple-200 bg-purple-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white p-2 rounded-lg text-purple-600 border border-purple-100"><FileText className="w-5 h-5" /></div>
                                            <div>
                                                <p className="text-sm font-bold text-purple-900">
                                                    Quotation #{typeof lead.quoteId === 'object' ? lead.quoteId._id.substring(lead.quoteId._id.length - 6) : lead.quoteId?.substring(lead.quoteId.length - 6)}
                                                </p>
                                                <p className="text-xs text-purple-700">
                                                    {typeof lead.quoteId === 'object' ? `${lead.quoteId.currency} ${lead.quoteId.grandTotal} • ${lead.quoteId.status}` : 'Loading details...'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {/* Placeholder for PDF View */}
                                            <Button size="sm" variant="outline" className="h-8 bg-white" onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}/quotes/${lead.quoteId._id}/pdf`, '_blank')}>View PDF</Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-slate-400 text-sm border border-dashed rounded-lg">No quotation generated yet.</div>
                                )}

                                {lead.saleId && (
                                    <div className="flex justify-between items-center p-3 border border-green-200 bg-green-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white p-2 rounded-lg text-green-600 border border-green-100"><FileCheck className="w-5 h-5" /></div>
                                            <div>
                                                <p className="text-sm font-bold text-green-900">Invoice (Sale Converted)</p>
                                                <p className="text-xs text-green-700">Total: {lead.saleId.totalAmount}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" className="h-8 bg-white" onClick={() => alert("Invoice PDF Coming Soon")}>View Invoice</Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
