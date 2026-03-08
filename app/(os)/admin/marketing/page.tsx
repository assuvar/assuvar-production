'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { PageHeader } from '@/components/os/ui/PageHeader';
import { Button } from '@/components/os/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/os/ui/Card';
import { Input } from '@/components/os/ui/Input';
import { Send, Users, Megaphone, CheckSquare, Square, Mail, Paperclip, X } from 'lucide-react';
import { toast } from 'sonner';
import { RichEditor } from '@/components/os/ui/RichEditor';

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
    const [attachments, setAttachments] = useState<File[]>([]);
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            // Limit to max 5 files
            if (attachments.length + newFiles.length > 5) {
                toast.error('Maximum 5 attachments allowed');
                return;
            }
            setAttachments(prev => [...prev, ...newFiles]);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSend = async () => {
        if (selectedEmails.size === 0) return toast.error('No recipients selected');
        if (!subject.trim()) return toast.error('Subject is required');
        if (!body.trim()) return toast.error('Email body is required');

        if (!confirm(`Are you sure you want to send this email to ${selectedEmails.size} recipients?`)) return;

        setSending(true);
        const recipients = resolvedEmails.filter(r => selectedEmails.has(r.email));

        try {
            const formData = new FormData();
            formData.append('subject', subject);
            formData.append('body', body);
            formData.append('recipients', JSON.stringify(recipients));

            attachments.forEach(file => {
                formData.append('attachments', file);
            });

            const res = await api.post('/marketing/send-bulk', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success(`Campaign sent! ${res.data.successCount} succeeded, ${res.data.failCount} failed.`);
            // Reset form
            setSubject('');
            setBody('');
            setAttachments([]);
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

                            <div className="flex-1 flex flex-col min-h-[400px]">
                                <label className="text-xs font-bold uppercase text-slate-500 mb-1.5 block">Email Body (Rich Text)</label>
                                <div className="border border-slate-200 rounded-lg overflow-hidden">
                                    <RichEditor
                                        value={body}
                                        onChange={setBody}
                                        placeholder="Draft your promotional campaign, update, or newsletter here..."
                                        height={400}
                                    />
                                </div>
                            </div>

                            {/* Attachments Section */}
                            <div>
                                <label className="text-xs font-bold uppercase text-slate-500 mb-2 flex items-center gap-1">
                                    <Paperclip className="h-3 w-3" /> Attachments
                                </label>
                                <div className="space-y-3">
                                    <input
                                        type="file"
                                        multiple
                                        className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-structura-blue hover:file:bg-blue-100 transition-colors"
                                        onChange={handleFileChange}
                                        disabled={attachments.length >= 5}
                                    />
                                    {attachments.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {attachments.map((file, i) => (
                                                <div key={i} className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-md text-xs border border-slate-200">
                                                    <span className="truncate max-w-[150px]" title={file.name}>{file.name}</span>
                                                    <button onClick={() => removeAttachment(i)} className="text-slate-400 hover:text-red-500">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <p className="text-[10px] text-slate-400">You can attach up to 5 files (Images, PDFs, etc.)</p>
                                </div>
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
