'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from "next/link";
import { Plus, Search, Eye, FileText, FileCheck, PhoneCall, Calendar, CheckSquare, Ban, Trash2, Info, Tag } from "lucide-react";
import { PageHeader } from "@/components/os/ui/PageHeader";
import { Button } from "@/components/os/ui/Button";
import { Card } from "@/components/os/ui/Card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/os/ui/Table";
import { StatusBadge } from "@/components/os/ui/StatusBadge";
import api from '@/lib/axios';
import { cn } from "@/lib/utils";
import { LeadViewModal } from "@/components/os/crm/LeadViewModal";
import { AddLeadModal } from "@/components/os/crm/AddLeadModal";

const TABS = ['All', 'New', 'Follow-Up', 'Quoted', 'Rejected'];

const getTabStatus = (tab: string) => {
    if (tab === 'All') return 'All';
    if (tab === 'Follow-Up') return 'follow_up';
    return tab.toLowerCase();
};

function LeadsContent() {
    const [leads, setLeads] = useState<any[]>([]);
    const [filteredLeads, setFilteredLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Schedule Modal State
    const [showFollowUpModal, setShowFollowUpModal] = useState(false);
    const [selectedLeadId, setSelectedLeadId] = useState('');
    const [followUpDate, setFollowUpDate] = useState('');
    const [followUpTime, setFollowUpTime] = useState('');
    const [noteText, setNoteText] = useState('');

    // Reject Modal State
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedLeadToReject, setSelectedLeadToReject] = useState('');
    const [rejectReason, setRejectReason] = useState('');

    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedViewLeadId, setSelectedViewLeadId] = useState('');

    const [showAddModal, setShowAddModal] = useState(false);

    const [activeTab, setActiveTab] = useState('All');
    const [filterAssignedTo, setFilterAssignedTo] = useState('All');
    const [filterLeadType, setFilterLeadType] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchLeads();
    }, []);

    useEffect(() => {
        let res = leads;

        if (activeTab !== 'All') {
            const targetStatus = getTabStatus(activeTab);
            res = res.filter(l => {
                const s = (l.status || '').toLowerCase();
                if (targetStatus === 'quoted') return ['interested', 'quoted', 'accepted', 'sold', 'won'].includes(s); // Grouping these under 'Quoted' tab visually per user request
                return s === targetStatus;
            });
        }

        if (filterAssignedTo !== 'All') {
            res = res.filter(l => l.assignedTo?._id === filterAssignedTo);
        }

        if (filterLeadType !== 'All') {
            res = res.filter(l => (l.leadType || '').toLowerCase() === filterLeadType.toLowerCase());
        }

        if (searchTerm) {
            const lowerQuery = searchTerm.toLowerCase();
            res = res.filter(l =>
                l.name?.toLowerCase().includes(lowerQuery) ||
                l.phone?.includes(lowerQuery) ||
                l.leadId?.toLowerCase().includes(lowerQuery)
            );
        }

        setFilteredLeads(res);
    }, [leads, activeTab, filterAssignedTo, filterLeadType, searchTerm]);

    const fetchLeads = async () => {
        try {
            const res = await api.get('/leads');
            const data = res.data.reverse();
            setLeads(data);
            setFilteredLeads(data);
        } catch (error) {
            console.error("Failed to fetch leads", error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickAction = async (id: string, endpoint: string, actionName: string) => {
        if (!confirm(`Are you sure you want to ${actionName}?`)) return;
        try {
            await api.put(`/leads/${id}/${endpoint}`);
            fetchLeads(); // Refresh table
        } catch (error: any) {
            alert(error.response?.data?.message || `Failed to ${actionName}`);
        }
    };

    const handleDeleteLead = async (id: string) => {
        if (!confirm('Are you strictly sure you want to completely delete this lead? This cannot be undone.')) return;
        try {
            await api.delete(`/leads/${id}`);
            fetchLeads();
        } catch (error: any) {
            alert(error.response?.data?.message || "Failed to delete lead");
        }
    };

    const openScheduleModal = (leadId: string) => {
        setSelectedLeadId(leadId);
        setShowFollowUpModal(true);
    };

    const openViewModal = (leadId: string) => {
        setSelectedViewLeadId(leadId);
        setShowViewModal(true);
    };

    const openRejectModal = (leadId: string) => {
        setSelectedLeadToReject(leadId);
        setShowRejectModal(true);
    };

    const submitReject = async () => {
        if (!rejectReason) return alert("Rejection reason is required.");
        try {
            setLoading(true);
            await api.put(`/leads/${selectedLeadToReject}/reject`, { note: rejectReason });
            setShowRejectModal(false);
            setRejectReason('');
            fetchLeads();
        } catch (error: any) {
            alert(error.response?.data?.message || "Failed to reject lead");
        } finally {
            setLoading(false);
        }
    };

    const submitFollowUp = async () => {
        if (!followUpDate || !followUpTime) return alert("Date and Time are required.");
        const dateTime = new Date(`${followUpDate}T${followUpTime}`).toISOString();
        try {
            setLoading(true);
            await api.put(`/leads/${selectedLeadId}/schedule-followup`, { nextFollowUp: dateTime, note: noteText });
            setShowFollowUpModal(false);
            setFollowUpDate(''); setFollowUpTime(''); setNoteText('');
            fetchLeads();
        } catch (error: any) {
            alert(error.response?.data?.message || "Failed to schedule");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const csvText = event.target?.result as string;
            const lines = csvText.split('\n').filter(line => line.trim() !== '');
            if (lines.length < 2) return alert("Empty or invalid CSV");

            const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());

            const isReferral = headers.includes('referralname');
            const isOutbound = !headers.includes('source') && !isReferral;
            const targetType = isReferral ? 'referral' : (isOutbound ? 'outbound' : 'inbound');

            const leadsPayload = [];
            for (let i = 1; i < lines.length; i++) {
                // Basic CSV regex split
                const line = lines[i];
                let values = [];
                let inQuotes = false;
                let currentVal = '';
                for (let j = 0; j < line.length; j++) {
                    const char = line[j];
                    if (char === '"') {
                        inQuotes = !inQuotes;
                    } else if (char === ',' && !inQuotes) {
                        values.push(currentVal);
                        currentVal = '';
                    } else {
                        currentVal += char;
                    }
                }
                values.push(currentVal);

                const cleanValues = values.map(v => v.trim().replace(/^"|"$/g, ''));

                const leadObj: any = {};
                headers.forEach((header, index) => {
                    if (cleanValues[index]) {
                        leadObj[header] = cleanValues[index];
                    }
                });

                if (leadObj.name && (leadObj.email || leadObj.phone)) {
                    leadsPayload.push({
                        ...leadObj,
                        companyName: leadObj.company || undefined,
                        leadType: targetType,
                        source: leadObj.source || 'csv-import',
                        status: 'new',
                        referralId: leadObj.referralname || undefined,
                        referralPhone: leadObj.referralphone || undefined
                    });
                }
            }

            if (leadsPayload.length === 0) {
                return alert("No valid leads found in CSV. Make sure you have 'name' and either 'email' or 'phone' columns.");
            }

            if (confirm(`Found ${leadsPayload.length} valid leads. Do you want to process the bulk upload?`)) {
                try {
                    setLoading(true);
                    const res = await api.post('/leads/bulk', { leads: leadsPayload });
                    alert(res.data.message);
                    fetchLeads();
                } catch (error: any) {
                    alert("Bulk upload failed: " + (error.response?.data?.message || "Unknown error"));
                } finally {
                    setLoading(false);
                }
            }

            // Allow re-uploading the same file
            if (e.target) e.target.value = '';
        };
        reader.readAsText(file);
    };

    // Extract unique assignees for filter
    const assignees = Array.from(new Set(leads.map(l => l.assignedTo?._id).filter(Boolean)))
        .map(id => leads.find(l => l.assignedTo?._id === id)?.assignedTo);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Leads"
                description="Manage your sales pipeline and track potential opportunities."
            >
                <div className="flex flex-col gap-2 items-end">
                    <div className="flex gap-2 text-xs">
                        <Button variant="ghost" size="sm" onClick={() => window.open('/templates/inbound-leads.csv')}>Inbound CSV</Button>
                        <Button variant="ghost" size="sm" onClick={() => window.open('/templates/outbound-leads.csv')}>Outbound CSV</Button>
                        <Button variant="ghost" size="sm" onClick={() => window.open('/templates/referral-leads.csv')}>Referral CSV</Button>
                    </div>
                    <div className="flex gap-2 items-center">
                        <Button variant="outline" onClick={() => document.getElementById('csv-upload')?.click()}>
                            <FileCheck className="mr-2 h-4 w-4 text-emerald-600" /> Bulk CSV Upload
                        </Button>
                        <input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                        <Button onClick={() => setShowAddModal(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Lead
                        </Button>
                    </div>
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
                            placeholder="Search by name, phone, or ID..."
                            className="h-10 w-full rounded-lg border border-structura-border pl-10 pr-4 text-sm focus:border-structura-blue focus:outline-none focus:ring-1 focus:ring-structura-blue"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            className="h-10 rounded-lg border border-structura-border px-3 text-sm bg-white focus:outline-none"
                            value={filterAssignedTo}
                            onChange={(e) => setFilterAssignedTo(e.target.value)}
                        >
                            <option value="All">All Assigned</option>
                            {assignees.map((user: any) => (
                                <option key={user._id} value={user._id}>{user.name}</option>
                            ))}
                        </select>
                        <select
                            className="h-10 rounded-lg border border-structura-border px-3 text-sm bg-white focus:outline-none"
                            value={filterLeadType}
                            onChange={(e) => setFilterLeadType(e.target.value)}
                        >
                            <option value="All">All Types</option>
                            <option value="inbound">Inbound</option>
                            <option value="outbound">Outbound</option>
                            <option value="referral">Referral</option>
                        </select>
                    </div>
                </div>

                {/* Added custom scrollbar styling to make it thicker */}
                <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 hover:scrollbar-thumb-slate-400 pb-2" style={{ scrollbarWidth: 'auto' }}>
                    <Table className="min-w-[1400px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Lead ID</TableHead>
                                <TableHead>Lead Name</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                {activeTab === 'Follow-Up' && <TableHead>Next Follow-Up</TableHead>}
                                <TableHead>Assigned To</TableHead>
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
                                        <TableCell className="font-medium text-slate-500">{lead.leadId || 'N/A'}</TableCell>
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
                                        <TableCell className="capitalize">{lead.leadType || '-'}</TableCell>
                                        <TableCell><StatusBadge status={lead.status} /></TableCell>
                                        {activeTab === 'Follow-Up' && (
                                            <TableCell>
                                                {lead.nextFollowUp ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={new Date(lead.nextFollowUp) < new Date() ? 'text-red-600 font-bold' : 'text-slate-600'}>
                                                            {new Date(lead.nextFollowUp).toLocaleDateString()}
                                                        </span>
                                                        {new Date(lead.nextFollowUp) < new Date() && <span className="w-2 h-2 rounded-full bg-red-500" title="Overdue"></span>}
                                                    </div>
                                                ) : <span className="text-slate-400">-</span>}
                                            </TableCell>
                                        )}
                                        <TableCell>{lead.assignedTo?.name || 'Unassigned'}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2 flex-wrap min-w-[420px]">
                                                {/* Contacted */}
                                                <Button size="sm" variant="outline" disabled={lead.status !== 'new'} className={cn("text-xs py-1 h-8 transition-opacity", lead.status === 'new' ? "border-blue-200 text-blue-600 hover:bg-blue-50" : "border-slate-200 text-slate-400 opacity-60")} onClick={(e) => { e.preventDefault(); if (lead.status === 'new') handleQuickAction(lead._id, 'mark-contacted', 'Mark Contacted'); }}>
                                                    <PhoneCall className="mr-1.5 h-3.5 w-3.5" /> Contacted
                                                </Button>

                                                {/* Schedule */}
                                                <Button size="sm" variant="outline" disabled={['quoted', 'sold', 'won', 'rejected'].includes(lead.status)} className={cn("text-xs py-1 h-8 transition-opacity", !['quoted', 'sold', 'won', 'rejected'].includes(lead.status) ? "border-yellow-200 text-yellow-700 hover:bg-yellow-50" : "border-slate-200 text-slate-400 opacity-60")} onClick={(e) => { e.preventDefault(); if (!['quoted', 'sold', 'won', 'rejected'].includes(lead.status)) openScheduleModal(lead._id); }}>
                                                    <Calendar className="mr-1.5 h-3.5 w-3.5" /> Schedule
                                                </Button>

                                                {/* Quote */}
                                                {['rejected'].includes(lead.status) ? (
                                                    <Button size="sm" variant="outline" disabled className="text-xs py-1 h-8 border-slate-200 text-slate-400 opacity-60">
                                                        <FileText className="mr-1.5 h-3.5 w-3.5" /> Quote
                                                    </Button>
                                                ) : lead.status === 'quoted' || lead.quoteId ? (
                                                    <Link href={`/admin/quotes/${lead.quoteId?._id || lead.quoteId}/edit`} onClick={(e) => e.stopPropagation()}>
                                                        <Button size="sm" variant="outline" className="text-xs py-1 h-8 border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-opacity">
                                                            <FileText className="mr-1.5 h-3.5 w-3.5" /> Quote (R)
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    <Link href={`/admin/quotes/create?leadId=${lead._id}`} onClick={(e) => e.stopPropagation()}>
                                                        <Button size="sm" variant="outline" className="text-xs py-1 h-8 border-purple-200 text-purple-600 hover:bg-purple-50 transition-opacity">
                                                            <FileText className="mr-1.5 h-3.5 w-3.5" /> Quote
                                                        </Button>
                                                    </Link>
                                                )}

                                                {/* Reject */}
                                                <Button size="sm" variant="outline" disabled={['follow_up', 'quoted', 'sold', 'won', 'rejected'].includes(lead.status)} className={cn("text-xs py-1 h-8 transition-opacity", !['follow_up', 'quoted', 'sold', 'won', 'rejected'].includes(lead.status) ? "border-red-200 text-red-600 hover:bg-red-50" : "border-slate-200 text-slate-400 opacity-60")} onClick={(e) => { e.preventDefault(); if (!['follow_up', 'quoted', 'sold', 'won', 'rejected'].includes(lead.status)) openRejectModal(lead._id); }}>
                                                    <Ban className="mr-1.5 h-3.5 w-3.5" /> Reject
                                                </Button>

                                                <Button size="sm" variant="secondary" className="text-xs py-1 h-8" onClick={(e) => { e.preventDefault(); openViewModal(lead._id); }}>
                                                    <Eye className="mr-1.5 h-3.5 w-3.5" /> View
                                                </Button>

                                                <Button size="sm" variant="ghost" className="text-xs py-1 h-8 text-slate-400 hover:text-red-600 hover:bg-red-50 px-2 transition-colors" onClick={(e) => { e.preventDefault(); handleDeleteLead(lead._id); }} title="Delete Lead">
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

            {/* Documentation & Guides Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
                {/* ID System Guide */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-indigo-500" />
                        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">ID Generation System</h3>
                    </div>
                    <div className="p-4 flex-1">
                        <p className="text-xs text-slate-500 mb-4">
                            The system uses a persistent identifier format that tracks an entity across its entire lifecycle (Lead → Quote → Sale → Client).
                        </p>
                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mb-4">
                            <code className="text-[11px] font-mono text-indigo-600 font-bold block mb-1">AS[Type][YY][MM]ID[Number]</code>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-slate-400">
                                <div><span className="text-slate-600 font-semibold">AS:</span> Company Prefix</div>
                                <div><span className="text-slate-600 font-semibold">Type:</span> L/Q/S/C/I</div>
                                <div><span className="text-slate-600 font-semibold">YYMM:</span> Year & Month</div>
                                <div><span className="text-slate-600 font-semibold">ID:</span> Constant Literal</div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-[11px] border-b border-slate-50 pb-1">
                                <span className="text-slate-500 italic">Example Lead:</span>
                                <span className="font-mono font-bold text-slate-700">ASL2603ID1</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                                <span className="text-slate-500 italic">Example Quote:</span>
                                <span className="font-mono font-bold text-slate-700">ASQ2603ID1</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-orange-600 mt-4 bg-orange-50 p-2 rounded border border-orange-100">
                            <strong>Note:</strong> The sequence number resets to 1 at the start of every new month.
                        </p>
                    </div>
                </div>

                {/* CSV Import Format Guide */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                        <Info className="w-4 h-4 text-blue-500" />
                        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">CSV Import Format Guide</h3>
                    </div>
                    <div className="p-0 overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-2 font-semibold">Header</th>
                                    <th className="px-4 py-2 font-semibold">Req</th>
                                    <th className="px-4 py-2 font-semibold">Description</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-600">
                                <tr className="hover:bg-slate-50"><td className="px-4 py-2 font-mono text-[11px] text-blue-600 font-semibold">name</td><td className="px-4 py-2 text-emerald-600">Yes</td><td className="px-4 py-2 text-slate-500">Contact full name.</td></tr>
                                <tr className="hover:bg-slate-50"><td className="px-4 py-2 font-mono text-[11px] text-blue-600 font-semibold">email</td><td className="px-4 py-2 text-emerald-600">Yes</td><td className="px-4 py-2 text-slate-500">Business email address.</td></tr>
                                <tr className="hover:bg-slate-50"><td className="px-4 py-2 font-mono text-[11px] text-blue-600 font-semibold">phone</td><td className="px-4 py-2 text-emerald-600">Yes</td><td className="px-4 py-2 text-slate-500">Mobile/office phone.</td></tr>
                                <tr className="hover:bg-slate-50"><td className="px-4 py-2 font-mono text-[11px] text-blue-600 font-semibold">company</td><td className="px-4 py-2 text-emerald-600">Yes</td><td className="px-4 py-2 text-slate-500">Organization name.</td></tr>
                                <tr className="bg-orange-50/30 hover:bg-orange-50"><td className="px-4 py-2 font-mono text-[11px] text-orange-600">referralname</td><td className="px-4 py-2 text-orange-600">Ref</td><td className="px-4 py-2 text-orange-700/80 italic">Required for Referral CSVs.</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Follow-Up Modal for List View */}
            {showFollowUpModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
                        <h3 className="text-lg font-bold">Schedule Follow-Up</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium mb-1 block text-slate-700">Date *</label>
                                <input type="date" className="w-full border rounded-lg p-2" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block text-slate-700">Time *</label>
                                <input type="time" className="w-full border rounded-lg p-2" value={followUpTime} onChange={e => setFollowUpTime(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block text-slate-700">Note (Optional)</label>
                                <textarea className="w-full border rounded-lg p-2 focus:ring focus:border-blue-300" rows={3} value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Enter instructions for the follow-up..."></textarea>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => setShowFollowUpModal(false)}>Cancel</Button>
                            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white" onClick={submitFollowUp} disabled={loading}>{loading ? 'Saving...' : 'Confirm Schedule'}</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal for List View */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
                        <h3 className="text-lg font-bold text-red-600">Reject Lead</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium mb-1 block text-slate-700">Reason for Rejection *</label>
                                <textarea className="w-full border rounded-lg p-2 focus:ring focus:border-red-300" rows={4} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Please provide a clear reason..."></textarea>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => setShowRejectModal(false)}>Cancel</Button>
                            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={submitReject} disabled={loading}>{loading ? 'Rejecting...' : 'Confirm Reject'}</Button>
                        </div>
                    </div>
                </div>
            )}

            {showViewModal && (
                <LeadViewModal
                    leadId={selectedViewLeadId}
                    onClose={() => setShowViewModal(false)}
                    onUpdate={fetchLeads}
                />
            )}

            {showAddModal && (
                <AddLeadModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => { setShowAddModal(false); fetchLeads(); }}
                />
            )}
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
