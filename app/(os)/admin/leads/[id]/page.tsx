'use client';

import { Building2, Mail, Phone, MapPin, Tag, UserPlus, PhoneCall, Ban, ThumbsUp, CheckSquare, FileText, ArrowRight, Pencil, Calendar, MessageSquare } from 'lucide-react';
import { PageHeader } from '@/components/os/ui/PageHeader';
import { Button } from '@/components/os/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/os/ui/Card';
import { StatusBadge } from '@/components/os/ui/StatusBadge';
import { LeadStatusTimeline } from '@/components/os/crm/LeadStatusTimeline';
import { use, useEffect, useState } from 'react';
import api from '@/lib/axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [lead, setLead] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const leadRes = await api.get(`/leads/${id}`);
            setLead(leadRes.data);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const [showFollowUpModal, setShowFollowUpModal] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [followUpDate, setFollowUpDate] = useState('');
    const [followUpTime, setFollowUpTime] = useState('');
    const [noteText, setNoteText] = useState('');

    const handleAction = async (action: string, endpoint: string, data?: any) => {
        if (!data?.note && !confirm(`Are you sure you want to ${action}?`)) return;
        try {
            setLoading(true);
            await api.put(`/leads/${id}/${endpoint}`, data);
            await fetchData();
        } catch (error: any) {
            console.error(`Failed to ${action}`, error);
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
        // We can just hit reject again to append note if rejected, or create a specific note endpoint.
        // For rejected leads, hitting reject again acts as an append note.
        await handleAction('Add Note', 'reject', { note: noteText });
        setShowNoteModal(false);
        setNoteText('');
    };

    if (loading) return <div>Loading...</div>;
    if (!lead) return <div>Lead not found</div>;

    const timelineSteps = [
        {
            status: 'new',
            label: 'New Lead',
            isCompleted: ['contacted', 'follow_up', 'interested', 'accepted', 'quoted', 'rejected'].includes(lead.status) || lead.status === 'new',
            isCurrent: lead.status === 'new',
        },
        {
            status: 'contacted',
            label: 'Contacted',
            isCompleted: ['follow_up', 'interested', 'accepted', 'quoted'].includes(lead.status) || lead.status === 'contacted',
            isCurrent: lead.status === 'contacted',
        },
        {
            status: 'follow_up',
            label: 'Follow-Up',
            isCompleted: ['interested', 'accepted', 'quoted'].includes(lead.status) || lead.status === 'follow_up',
            isCurrent: lead.status === 'follow_up',
        },
        {
            status: 'interested',
            label: 'Interested',
            isCompleted: ['accepted', 'quoted'].includes(lead.status) || lead.status === 'interested',
            isCurrent: lead.status === 'interested',
        },
        {
            status: 'accepted',
            label: 'Accepted',
            isCompleted: ['quoted'].includes(lead.status) || lead.status === 'accepted',
            isCurrent: lead.status === 'accepted',
        },
        {
            status: 'quoted',
            label: 'Quoted',
            isCompleted: lead.status === 'quoted',
            isCurrent: lead.status === 'quoted',
        }
    ];

    if (lead.status === 'rejected') {
        timelineSteps.push({
            status: 'rejected',
            label: 'Rejected',
            isCompleted: true,
            isCurrent: true,
        });
    }

    return (
        <div className="space-y-6">
            <PageHeader title={lead.name} description="Lead Details & Intelligence">
                <div className="flex items-center gap-3">
                    <StatusBadge status={lead.status} />
                    <Link href={`/admin/leads/${id}/edit`}>
                        <Button variant="outline" size="sm">
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit details
                        </Button>
                    </Link>
                </div>
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT COLUMN: Client Info */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 h-fit">
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-structura-black">{lead.name}</h2>
                        <div className="flex items-center gap-2 text-slate-500 mt-1">
                            <span className="font-mono text-sm bg-slate-100 px-2 py-0.5 rounded border">{lead.leadId || lead._id}</span>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100 items-start flex flex-col justify-start text-left">
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
                            <span>{lead.source}</span>
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
                                <span className="text-sm text-slate-500 italic">No specific services selected.</span>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <p className="text-sm font-semibold">Assigned To:</p>
                        <p className="text-sm text-slate-600">{lead.assignedTo?.name || 'Unassigned'}</p>
                    </div>
                </div>

                {/* CENTER COLUMN: Activity Timeline */}
                <div className="space-y-6 bg-white rounded-xl border border-slate-200 p-6">
                    <h3 className="text-lg font-bold mb-4">Lead Progress</h3>
                    <LeadStatusTimeline steps={timelineSteps} />

                    <div className="mt-8">
                        <h3 className="text-lg font-bold mb-4">Internal Notes & History</h3>
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
                                <div key={idx} className="relative">
                                    <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-slate-300 border-2 border-white"></div>
                                    <p className="text-sm font-medium text-slate-700">{log.action}</p>
                                    <p className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleString()}</p>
                                </div>
                            )) : <p className="text-sm text-slate-500 italic">No activity logged.</p>}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Dynamic Action Panel */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 h-fit">
                    <h3 className="text-lg font-bold mb-4">Actions</h3>

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
                                    onClick={() => handleAction('Reject Lead', 'reject')}
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
                                    onClick={() => handleAction('Reject Lead', 'reject')}
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
                                    onClick={() => handleAction('Reject Lead', 'reject')}
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
                                    onClick={() => handleAction('Reject Lead', 'reject')}
                                >
                                    <Ban className="mr-2 h-4 w-4" /> Reject
                                </Button>
                            </>
                        )}

                        {lead.status === 'accepted' && (
                            <>
                                <Button
                                    className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white"
                                    onClick={() => router.push(`/admin/quotes/create?leadId=${id}`)}
                                >
                                    <FileText className="mr-2 h-4 w-4" /> Create Quotation
                                </Button>
                            </>
                        )}

                        {lead.status === 'quoted' && (
                            <>
                                <Button
                                    className="w-full justify-start bg-slate-100 text-slate-700 hover:bg-slate-200"
                                    onClick={() => router.push(`/admin/quotes`)}
                                >
                                    <ArrowRight className="mr-2 h-4 w-4" /> View Quotations
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
                    </div>
                </div>
            </div>

            {/* Follow-Up Modal */}
            {showFollowUpModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
                        <h3 className="text-lg font-bold">Schedule Follow-Up</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium mb-1 block text-slate-700">Date</label>
                                <input type="date" className="w-full border rounded-lg p-2" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block text-slate-700">Time</label>
                                <input type="time" className="w-full border rounded-lg p-2" value={followUpTime} onChange={e => setFollowUpTime(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block text-slate-700">Note (Optional)</label>
                                <textarea className="w-full border rounded-lg p-2 focus:ring focus:border-blue-300" rows={3} value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Enter details..."></textarea>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => setShowFollowUpModal(false)}>Cancel</Button>
                            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white" onClick={submitFollowUp} disabled={loading}>{loading ? 'Saving...' : 'Schedule'}</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Note Modal */}
            {showNoteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
                        <h3 className="text-lg font-bold">Add Note</h3>
                        <div>
                            <textarea className="w-full border rounded-lg p-2 focus:ring focus:border-blue-300" rows={4} value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Type your note here..."></textarea>
                        </div>
                        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                            <Button variant="outline" onClick={() => setShowNoteModal(false)}>Cancel</Button>
                            <Button onClick={submitNote} disabled={loading}>{loading ? 'Saving...' : 'Add Note'}</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
