'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { PageHeader } from '@/components/os/ui/PageHeader';
import { Button } from '@/components/os/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/os/ui/Card';
import { Input } from '@/components/os/ui/Input';
import { Send, Users, Megaphone, CheckSquare, Square, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function MarketingPage() {
    const [audiences, setAudiences] = useState<any>({
        allLeads: [],
        rejectedLeads: [],
        allQuotes: [],
        acceptedQuotes: [],
        rejectedQuotes: [],
        allClients: [],
        amcReminders: []
    });

    const [loading, setLoading] = useState(true);

    // UI state
    const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
    const [resolvedEmails, setResolvedEmails] = useState<any[]>([]);
    const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set());

    // Email form state
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchAudiences();
    }, []);

    const fetchAudiences = async () => {
        try {
            const res = await api.get('/marketing/audiences');
            setAudiences(res.data);
        } catch (error) {
            console.error('Error fetching audiences', error);
            toast.error('Failed to load audience data');
        } finally {
            setLoading(false);
        }
    };

    // Whenever segments change, resolve the total list of emails
    useEffect(() => {
        const aggregated = new Map();

        selectedSegments.forEach(segmentKey => {
            const list = audiences[segmentKey] || [];
            list.forEach((item: any) => {
                if (item.email && !aggregated.has(item.email)) {
                    aggregated.set(item.email, item);
                }
            });
        });

        const newResolved = Array.from(aggregated.values());
        setResolvedEmails(newResolved);

        // Auto-select all newly resolved emails
        setSelectedEmails(new Set(newResolved.map(e => e.email)));
    }, [selectedSegments, audiences]);

    const toggleSegment = (segmentKey: string) => {
        setSelectedSegments(prev =>
            prev.includes(segmentKey)
                ? prev.filter(k => k !== segmentKey)
                : [...prev, segmentKey]
        );
    };

    const toggleEmail = (email: string) => {
        const next = new Set(selectedEmails);
        if (next.has(email)) next.delete(email);
        else next.add(email);
        setSelectedEmails(next);
    };

    const handleSend = async () => {
        if (selectedEmails.size === 0) return toast.error('No recipients selected');
        if (!subject.trim()) return toast.error('Subject is required');
        if (!body.trim()) return toast.error('Email body is required');

        if (!confirm(`Are you sure you want to send this email to ${selectedEmails.size} recipients?`)) return;

        setSending(true);
        const recipients = resolvedEmails.filter(r => selectedEmails.has(r.email));

        try {
            const res = await api.post('/marketing/send-bulk', {
                recipients,
                subject,
                body
            });
            toast.success(`Campaign sent! ${res.data.successCount} succeeded, ${res.data.failCount} failed.`);
            // Reset form
            setSubject('');
            setBody('');
        } catch (error) {
            console.error(error);
            toast.error('Failed to send campaign');
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div className="p-8 text-slate-500">Loading audiences...</div>;

    const segmentDefinitions = [
        { key: 'allLeads', label: 'All Leads', icon: <Users className="h-4 w-4 text-blue-500" /> },
        { key: 'rejectedLeads', label: 'Rejected / Lost Leads', icon: <Users className="h-4 w-4 text-red-500" /> },

        { key: 'allQuotes', label: 'All Quotes', icon: <Megaphone className="h-4 w-4 text-purple-500" /> },
        { key: 'acceptedQuotes', label: 'Accepted Quotes', icon: <Megaphone className="h-4 w-4 text-green-500" /> },
        { key: 'rejectedQuotes', label: 'Rejected Quotes', icon: <Megaphone className="h-4 w-4 text-orange-500" /> },

        { key: 'allClients', label: 'All Active Clients', icon: <Megaphone className="h-4 w-4 text-teal-500" /> },
        { key: 'amcReminders', label: 'AMC Reminders (Due/Past)', icon: <Megaphone className="h-4 w-4 text-red-500" /> },
    ];

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-20">
            <PageHeader
                title="Bulk Email Marketing"
                description="Select target segments, draft your message, and send to multiple recipients instantly."
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT: Audience Selection Panels */}
                <div className="lg:col-span-5 space-y-6">
                    <Card className="shadow-sm border-t-4 border-t-structura-blue">
                        <CardHeader className="bg-slate-50 border-b pb-4">
                            <CardTitle className="text-base">1. Select Segments</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y">
                                {segmentDefinitions.map((seg) => {
                                    const count = audiences[seg.key]?.length || 0;
                                    const isSelected = selectedSegments.includes(seg.key);
                                    return (
                                        <div
                                            key={seg.key}
                                            className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                                            onClick={() => toggleSegment(seg.key)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-slate-100'}`}>
                                                    {seg.icon}
                                                </div>
                                                <div>
                                                    <p className={`font-semibold text-sm ${isSelected ? 'text-structura-blue' : 'text-slate-700'}`}>
                                                        {seg.label}
                                                    </p>
                                                    <p className="text-xs text-slate-500">{count} people available</p>
                                                </div>
                                            </div>
                                            <div>
                                                {isSelected ? <CheckSquare className="text-structura-blue h-5 w-5" /> : <Square className="text-slate-300 h-5 w-5" />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Resolved Individual List */}
                    {resolvedEmails.length > 0 && (
                        <Card className="shadow-sm">
                            <CardHeader className="bg-slate-50 border-b pb-3 pt-3 flex flex-row items-center justify-between">
                                <CardTitle className="text-sm">Resolved Recipients ({selectedEmails.size} selected)</CardTitle>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs"
                                    onClick={() => {
                                        if (selectedEmails.size === resolvedEmails.length) setSelectedEmails(new Set());
                                        else setSelectedEmails(new Set(resolvedEmails.map(e => e.email)));
                                    }}
                                >
                                    {selectedEmails.size === resolvedEmails.length ? 'Deselect All' : 'Select All'}
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="max-h-64 overflow-y-auto divide-y bg-white">
                                    {resolvedEmails.map(person => {
                                        const checked = selectedEmails.has(person.email);
                                        return (
                                            <label key={person.email} className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="rounded text-structura-blue"
                                                    checked={checked}
                                                    onChange={() => toggleEmail(person.email)}
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-medium text-slate-800 truncate">{person.name || 'Unknown Name'}</p>
                                                        {person.companyName && (
                                                            <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100 font-semibold truncate max-w-[150px]">
                                                                {person.companyName}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-500 truncate">{person.email}</p>
                                                </div>
                                                <div className="ml-auto flex-shrink-0">
                                                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                                                        {person.source}
                                                    </span>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* RIGHT: Email Composer */}
                <div className="lg:col-span-7">
                    <Card className="shadow-md h-full flex flex-col">
                        <CardHeader className="bg-slate-50 border-b pb-4">
                            <CardTitle className="text-base flex items-center">
                                <Mail className="h-4 w-4 mr-2 text-structura-blue" />
                                2. Draft & Send
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 flex-1 flex flex-col space-y-5">
                            <div>
                                <label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block">Subject Line</label>
                                <Input
                                    placeholder="Enter campaign subject..."
                                    value={subject}
                                    onChange={e => setSubject(e.target.value)}
                                    className="border-slate-300 focus:ring-structura-blue font-medium"
                                />
                            </div>

                            <div className="flex-1 flex flex-col min-h-[300px]">
                                <label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block">Email Body (Supports basic HTML & Line breaks)</label>
                                <textarea
                                    className="flex-1 w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-structura-blue focus:border-transparent resize-none text-sm text-slate-700"
                                    placeholder="Write your email content here..."
                                    value={body}
                                    onChange={e => setBody(e.target.value)}
                                />
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-500">
                                    {selectedEmails.size === 0
                                        ? 'Select recipients to send'
                                        : `Ready to send to ${selectedEmails.size} people`}
                                </span>

                                <Button
                                    className="bg-structura-blue hover:bg-blue-700 px-8 py-5"
                                    disabled={sending || selectedEmails.size === 0}
                                    onClick={handleSend}
                                >
                                    {sending ? 'Sending...' : (
                                        <>
                                            <Send className="h-4 w-4 mr-2" />
                                            Send Campaign
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
