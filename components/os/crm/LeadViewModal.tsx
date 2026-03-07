'use client';

import { Building2, Mail, Phone, Tag, Pencil, MessageSquare, X, PhoneCall, Ban, ThumbsUp, CheckSquare, FileText, Calendar } from 'lucide-react';
import { Button } from '@/components/os/ui/Button';
import { StatusBadge } from '@/components/os/ui/StatusBadge';
import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { ClockTimePicker } from '@/components/os/ui/ClockTimePicker';

export function LeadViewModal({ leadId, onClose, onUpdate }: { leadId: string, onClose: () => void, onUpdate?: () => void }) {
    const router = useRouter();
    const [lead, setLead] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [showFollowUpModal, setShowFollowUpModal] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [followUpDate, setFollowUpDate] = useState('');
    const [followUpTime, setFollowUpTime] = useState('');
    const [noteText, setNoteText] = useState('');

    useEffect(() => {
        if (leadId) {
            fetchData();
        }
    }, [leadId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/leads/${leadId}`);
            setLead(res.data);
        } catch (error) {
            console.error("Error fetching lead", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action: string, endpoint: string, data?: any) => {
        if (!data?.note && !confirm(`Are you sure you want to ${action}?`)) return;
        try {
            setLoading(true);
            await api.put(`/leads/${leadId}/${endpoint}`, data);
            await fetchData();
            if (onUpdate) onUpdate();
        } catch (error: any) {
            alert(error.response?.data?.message || `Failed to ${action}`);
        } finally {
            setLoading(false);
        }
    };

    const submitFollowUp = async () => {
        if (!followUpDate || !followUpTime) return alert("Date and Time are required.");
        const dateTime = new Date(`${followUpDate}T${followUpTime}`).toISOString();
        await handleAction('Schedule Follow-Up', 'schedule-followup', { nextFollowUp: dateTime, note: noteText });
        setShowFollowUpModal(false);
        setFollowUpDate(''); setFollowUpTime(''); setNoteText('');
    };

    const submitNote = async () => {
        if (!noteText) return alert("Note is required.");
        await handleAction('Add Note', 'reject', { note: noteText });
        setShowNoteModal(false);
        setNoteText('');
    };

    if (loading || !lead) {
        return (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl flex items-center justify-center">
                    <p className="text-slate-500 font-medium">Loading Lead Details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 lg:p-10 overflow-auto overflow-x-hidden pt-20">
            <div className="bg-slate-50 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh]">

                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white rounded-t-2xl shrink-0 sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            {lead.name}
                            <StatusBadge status={lead.status} />
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">Lead ID: <span className="font-mono bg-slate-100 px-1 border rounded">{lead.leadId}</span></p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/admin/leads/${lead._id}/edit`)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit details
                        </Button>
                        <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full hover:bg-slate-100">
                            <X className="w-5 h-5 text-slate-500" />
                        </Button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* LEFT COLUMN: Client Info */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 h-fit">
                            <h3 className="text-lg font-bold">Client Information</h3>
                            <div className="space-y-4 pt-1 items-start flex flex-col justify-start text-left">
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                    <span>{lead.email || 'No email'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Phone className="h-4 w-4 text-slate-400" />
                                    <span>{lead.phone || 'No phone'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-600">
                                    <Building2 className="h-4 w-4 text-slate-400" />
                                    <span className="capitalize">{lead.source}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Service Interest</h4>
                                <div className="flex flex-wrap gap-2">
                                    {lead.serviceInterest && lead.serviceInterest.length > 0 ? (
                                        lead.serviceInterest.map((tag: string) => (
                                            <span key={tag} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100 flex items-center gap-1">
                                                <Tag className="w-3 h-3" /> {tag}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-slate-500 italic">No specific services.</span>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-sm font-semibold">Assigned To:</p>
                                <p className="text-sm text-slate-600">{lead.assignedTo?.name || 'Unassigned'}</p>
                            </div>

                            {lead.leadType === 'referral' && (
                                <div className="pt-4 border-t border-slate-100 bg-orange-50/50 -mx-6 px-6 pb-2 rounded-b-xl">
                                    <h4 className="text-xs font-bold text-orange-800 uppercase mb-3 flex items-center gap-2">
                                        <Building2 className="w-3 h-3" /> Referral Details
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-orange-900/60 font-medium">Referred By</p>
                                            <p className="text-sm text-orange-900 font-semibold">{lead.referralId || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-orange-900/60 font-medium">Commission</p>
                                            <p className="text-sm text-orange-900 font-semibold">{lead.referralPercentage || 0}%</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-orange-900/60 font-medium">Referrer Email</p>
                                            <p className="text-sm text-orange-900">{lead.referralEmail || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-orange-900/60 font-medium">Referrer Phone</p>
                                            <p className="text-sm text-orange-900">{lead.referralPhone || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: Notes & Activity */}
                        <div className="space-y-6 bg-white rounded-xl border border-slate-200 p-6">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-bold">Notes</h3>
                                </div>

                                {lead.internalNotes && (
                                    <div className="bg-yellow-50 text-yellow-800 p-3 rounded border border-yellow-200 text-sm mb-4">
                                        <strong>Admin Note:</strong> {lead.internalNotes}
                                    </div>
                                )}
                                <div className="space-y-3">
                                    {lead.notes && lead.notes.length > 0 ? lead.notes.map((n: any, idx: number) => (
                                        <div key={idx} className="bg-slate-50 p-3 rounded-md border text-sm text-slate-700">
                                            <p className="whitespace-pre-wrap">{n.text}</p>
                                            <p className="text-xs text-slate-400 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                                        </div>
                                    )) : <p className="text-sm text-slate-500 italic">No notes available.</p>}
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <h3 className="text-lg font-bold mb-4">Activity Logs</h3>
                                <div className="space-y-4 border-l-2 border-slate-200 ml-2 pl-4">
                                    {lead.activityLogs && lead.activityLogs.length > 0 ? lead.activityLogs.map((log: any, idx: number) => (
                                        <div key={idx} className="relative flex items-center">
                                            <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-slate-300 border-2 border-white"></div>
                                            <div>
                                                <p className="text-sm font-medium text-slate-700">{log.action}</p>
                                                <p className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    )) : <p className="text-sm text-slate-500 italic">No activity logged.</p>}
                                </div>
                            </div>
                        </div>

                        {/* THIRD COLUMN: Quick Actions */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 h-fit">
                            <h3 className="text-lg font-bold">Actions</h3>

                            <div className="space-y-3">
                                {lead.status === 'new' && (
                                    <>
                                        <Button
                                            className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
                                            onClick={() => handleAction('Mark Contacted', 'mark-contacted')}
                                        >
                                            <PhoneCall className="mr-2 h-4 w-4" /> Mark Contacted
                                        </Button>
                                        <Button
                                            className="w-full justify-start bg-red-100 text-red-700 hover:bg-red-200"
                                            onClick={() => setShowNoteModal(true)}
                                        >
                                            <Ban className="mr-2 h-4 w-4" /> Reject
                                        </Button>
                                    </>
                                )}

                                {lead.status === 'contacted' && (
                                    <>
                                        <Button
                                            className="w-full justify-start bg-orange-500 hover:bg-orange-600 text-white"
                                            onClick={() => handleAction('Mark Interested', 'mark-interested')}
                                        >
                                            <ThumbsUp className="mr-2 h-4 w-4" /> Mark Interested
                                        </Button>
                                        <Button
                                            className="w-full justify-start bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
                                            onClick={() => setShowFollowUpModal(true)}
                                        >
                                            <Calendar className="mr-2 h-4 w-4" /> Schedule Follow-Up
                                        </Button>
                                        <Button
                                            className="w-full justify-start bg-red-100 text-red-700 hover:bg-red-200"
                                            onClick={() => setShowNoteModal(true)}
                                        >
                                            <Ban className="mr-2 h-4 w-4" /> Reject
                                        </Button>
                                    </>
                                )}

                                {lead.status === 'follow_up' && (
                                    <>
                                        <Button
                                            className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
                                            onClick={() => handleAction('Mark Contacted', 'mark-contacted')}
                                        >
                                            <PhoneCall className="mr-2 h-4 w-4" /> Mark Contacted
                                        </Button>
                                        <Button
                                            className="w-full justify-start bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
                                            onClick={() => setShowFollowUpModal(true)}
                                        >
                                            <Calendar className="mr-2 h-4 w-4" /> Reschedule
                                        </Button>
                                        <Button
                                            className="w-full justify-start bg-red-100 text-red-700 hover:bg-red-200"
                                            onClick={() => setShowNoteModal(true)}
                                        >
                                            <Ban className="mr-2 h-4 w-4" /> Reject
                                        </Button>
                                    </>
                                )}

                                {lead.status === 'interested' && (
                                    <>
                                        <Button
                                            className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => handleAction('Accept Lead', 'accept')}
                                        >
                                            <CheckSquare className="mr-2 h-4 w-4" /> Accept
                                        </Button>
                                        <Button
                                            className="w-full justify-start bg-red-100 text-red-700 hover:bg-red-200"
                                            onClick={() => setShowNoteModal(true)}
                                        >
                                            <Ban className="mr-2 h-4 w-4" /> Reject
                                        </Button>
                                    </>
                                )}

                                {lead.status === 'accepted' && (
                                    <>
                                        <div className="text-center text-emerald-600 text-sm italic py-4">
                                            This lead has been accepted.
                                        </div>
                                        <Button
                                            disabled
                                            className="w-full justify-start bg-slate-100 text-slate-400 opacity-60"
                                        >
                                            <FileText className="mr-2 h-4 w-4" /> Create Quotation
                                        </Button>
                                    </>
                                )}

                                {lead.status === 'rejected' && (
                                    <>
                                        <div className="text-center text-red-500 text-sm italic py-4">
                                            This lead has been rejected.
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => setShowNoteModal(true)}
                                        >
                                            <MessageSquare className="mr-2 h-4 w-4" /> Add Note
                                        </Button>
                                    </>
                                )}

                                {lead.status === 'quoted' && (
                                    <div className="text-center text-indigo-600 text-sm italic py-4 border border-indigo-100 rounded-lg bg-indigo-50/30">
                                        Quotation has been generated.
                                    </div>
                                )}
                            </div>

                            <p className="text-[10px] text-slate-400 mt-4 italic">
                                * Finalized leads (Accepted/Rejected) have limited actions to prevent data inconsistency.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Injected Modals */}
            {showFollowUpModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
                        <h3 className="text-lg font-bold">Schedule Follow-Up</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium mb-1 block text-slate-700">Date *</label>
                                <input type="date" className="w-full border rounded-lg p-2" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block text-slate-700">Time *</label>
                                <ClockTimePicker value={followUpTime} onChange={setFollowUpTime} placeholder="Select time..." />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block text-slate-700">Note (Optional)</label>
                                <textarea className="w-full border rounded-lg p-2" rows={3} value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Provide context..."></textarea>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => setShowFollowUpModal(false)}>Cancel</Button>
                            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white" onClick={submitFollowUp} disabled={loading}>{loading ? 'Saving...' : 'Confirm Schedule'}</Button>
                        </div>
                    </div>
                </div>
            )}

            {showNoteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
                        <h3 className="text-lg font-bold">Add Note</h3>
                        <div>
                            <textarea className="w-full border rounded-lg p-2" rows={4} value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Type your note..."></textarea>
                        </div>
                        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                            <Button variant="outline" onClick={() => setShowNoteModal(false)}>Cancel</Button>
                            <Button onClick={submitNote} disabled={loading}>{loading ? 'Saving...' : 'Save Note'}</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

