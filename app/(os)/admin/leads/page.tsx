'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from "next/link";
import { Plus, Search, Filter, Eye, FileText, CheckCircle, DollarSign, FileCheck } from "lucide-react";
import { PageHeader } from "@/components/os/ui/PageHeader";
import { Button } from "@/components/os/ui/Button";
import { Card } from "@/components/os/ui/Card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/os/ui/Table";
import { StatusBadge } from "@/components/os/ui/StatusBadge";
import api from '@/lib/axios';

function LeadsContent() {
    const [leads, setLeads] = useState<any[]>([]);
    const [filteredLeads, setFilteredLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [filterPriority, setFilterPriority] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLeads();
    }, []);

    useEffect(() => {
        let res = leads;
        if (filterStatus !== 'All') res = res.filter(l => l.status === filterStatus);
        if (filterPriority !== 'All') res = res.filter(l => l.priority === filterPriority);
        if (searchTerm) res = res.filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredLeads(res);
    }, [leads, filterStatus, filterPriority, searchTerm]);

    const fetchLeads = async () => {
        try {
            const res = await api.get('/leads');
            const data = res.data.reverse(); // Newest first
            setLeads(data);
            setFilteredLeads(data);
        } catch (error) {
            console.error("Failed to fetch leads", error);
        } finally {
            setLoading(false);
        }
    };

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
            <PageHeader
                title="Leads"
                description="Manage your sales pipeline and track potential opportunities."
            >
                <Link href="/admin/leads/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Lead
                    </Button>
                </Link>
            </PageHeader>

            <Card className="p-0">
                <div className="flex flex-wrap items-center justify-between p-4 border-b border-structura-border bg-white rounded-t-xl gap-4">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            className="h-10 w-full rounded-lg border border-structura-border pl-10 pr-4 text-sm focus:border-structura-blue focus:outline-none focus:ring-1 focus:ring-structura-blue"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            className="h-10 rounded-lg border border-structura-border px-3 text-sm bg-white focus:outline-none"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="NEW">New</option>
                            <option value="CONTACTED">Contacted</option>
                            <option value="QUOTED">Quoted</option>
                            <option value="CLOSED_WON">Won</option>
                        </select>
                        <select
                            className="h-10 rounded-lg border border-structura-border px-3 text-sm bg-white focus:outline-none"
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                        >
                            <option value="All">All Priority</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Lead Name</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Lead ID</TableHead>
                            <TableHead>Source</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Linked Docs</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={8} className="text-center py-4">Loading...</TableCell></TableRow>
                        ) : filteredLeads.length === 0 ? (
                            <TableRow><TableCell colSpan={8} className="text-center py-4">No leads found.</TableCell></TableRow>
                        ) : (
                            filteredLeads.map((lead) => (
                                <TableRow key={lead._id} className="cursor-pointer hover:bg-slate-50">
                                    <TableCell className="font-medium">{lead.leadId || 'N/A'}</TableCell>
                                    <TableCell className="font-medium text-structura-black">
                                        <Link href={`/admin/leads/${lead._id}`} className="hover:underline hover:text-structura-blue block">
                                            {lead.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{lead.phone || '-'}</span>
                                            <span className="text-xs text-slate-500">{lead.email || '-'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{lead.source}</TableCell>
                                    <TableCell><PriorityBadge priority={lead.priority} /></TableCell>
                                    <TableCell><StatusBadge status={lead.status} /></TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            {lead.quoteId && (
                                                <Link href={`/admin/leads/${lead._id}`} title={`Quote: ${lead.quoteId.status}`}>
                                                    <FileText className="h-4 w-4 text-purple-500 hover:text-purple-700" />
                                                </Link>
                                            )}
                                            {lead.saleId && (
                                                <Link href={`/admin/leads/${lead._id}`} title="Sale Converted">
                                                    <FileCheck className="h-4 w-4 text-green-500 hover:text-green-700" />
                                                </Link>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {/* View Always */}
                                            <Link href={`/admin/leads/${lead._id}`}>
                                                <Button variant="ghost" size="sm" title="View Details">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>

                                            {/* Logic: New/Contacted -> Create Quote */}
                                            {['NEW', 'CONTACTED', 'REQUIREMENT GATHERING'].includes(lead.status) && (
                                                <Link href={`/admin/quotes/create?leadId=${lead._id}`}>
                                                    <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50" title="Create Quote">
                                                        <FileText className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            )}

                                            {/* Logic: Quoted -> Convert to Sale */}
                                            {lead.status === 'QUOTED' && (
                                                <Link href={`/admin/sales/create?leadId=${lead._id}&quoteId=${lead.quoteId}`}>
                                                    <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50" title="Convert to Sale">
                                                        <DollarSign className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            )}

                                            {/* Logic: Won -> View Invoice */}
                                            {lead.status === 'CLOSED_WON' && (
                                                <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-slate-50" title="View Invoice">
                                                    <FileCheck className="h-4 w-4" />
                                                </Button>
                                            )}
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

export default function LeadsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LeadsContent />
        </Suspense>
    );
}
