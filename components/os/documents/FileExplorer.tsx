'use client';

import { useState, useEffect } from 'react';
import {
    Folder, FileText, MoreVertical,
    Image as ImageIcon, Trash2,
    Download, ExternalLink,
    ChevronRight, FolderOpen
} from "lucide-react";
import { Card, CardContent } from "@/components/os/ui/Card";
import { Button } from "@/components/os/ui/Button";
import api from '@/lib/axios';
import { cn } from '@/lib/utils';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/os/ui/Table";
import { StatusBadge } from '@/components/os/ui/StatusBadge';

interface FileItem {
    _id: string;
    name: string;
    type: string;
    size: string;
    url: string;
    category: string;
    subCategory?: string;
    createdAt: string;
    isDynamic?: boolean;
    referenceId?: {
        _id: string;
        quotationId?: string;
        saleId?: string;
        leadId?: {
            name: string;
            email: string;
            rootId?: string;
        };
        quoteId?: {
            leadId?: {
                name: string;
                email: string;
                rootId?: string;
            };
        };
        clientReference?: string;
    };
}

interface FileExplorerProps {
    currentFolder: string | null;
    currentSubFolder: string | null;
    onFolderClick: (folder: string) => void;
    onSubFolderClick: (subFolder: string | null) => void;
    clientId?: string;
}

const folders = [
    { name: 'Quotations', description: 'Generated proposals & quote drafts' },
    { name: 'Advance Receipts', description: 'Proof of advance payments' },
    { name: 'Invoices', description: 'Final project invoices' },
    { name: 'Pay Slips', description: 'Employee salary slips' },
    { name: 'Agreements', description: 'Legal contracts and signed docs' },
];

const quotationStatuses = ['Draft', 'Sent', 'Accepted', 'Rejected', 'Revised'];

export function FileExplorer({ currentFolder, currentSubFolder, onFolderClick, onSubFolderClick, clientId }: FileExplorerProps) {
    const [files, setFiles] = useState<FileItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentFolder || clientId) {
            fetchFiles();
        }
    }, [currentFolder, currentSubFolder, clientId]);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const categoryToFetch = currentFolder ? currentFolder : 'All';
            let url = `/documents?category=${categoryToFetch}`;
            if (currentSubFolder) {
                // Ensure we handle potential inconsistencies in case or spacing if they exist
                url += `&subCategory=${currentSubFolder}`;
            }
            if (clientId) {
                url += `&clientId=${clientId}`;
            }
            const res = await api.get(url);
            setFiles(res.data);
        } catch (error) {
            console.error("Failed to fetch documents", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this document?')) {
            try {
                await api.delete(`/documents/${id}`);
                fetchFiles();
            } catch (error) {
                alert("Failed to delete document");
            }
        }
    };

    const handleDownload = async (file: FileItem) => {
        try {
            if (file.isDynamic) {
                // Fetch direct from URL
                const response = await api.get(file.url.replace(/^\/api/, ''), {
                    responseType: 'blob'
                });
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                let fileName = file.name;
                if (!fileName.toLowerCase().endsWith('.pdf') && file.type === 'pdf') {
                    fileName += '.pdf';
                }
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
                return;
            }

            const response = await api.get(`/documents/${file._id}/download`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            let fileName = file.name;
            if (!fileName.toLowerCase().endsWith('.pdf') && file.type === 'pdf') {
                fileName += '.pdf';
            }
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Download failed", error);
            alert("Failed to download file");
        }
    };

    const getClientInfo = (file: FileItem) => {
        if (!file.referenceId) return null;

        // Try Quote first
        const lead = file.referenceId.leadId || file.referenceId.quoteId?.leadId;
        if (lead) {
            return {
                name: lead.name,
                email: lead.email,
                id: lead.rootId || 'NEW'
            };
        }

        // Fallback to clientReference for sales
        if (file.referenceId.clientReference) {
            return {
                name: file.referenceId.clientReference,
                email: 'N/A',
                id: 'REF'
            };
        }

        return null;
    };

    if (!currentFolder && !clientId) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {folders.map((folder) => (
                    <Card
                        key={folder.name}
                        className="group hover:shadow-lg transition-all border-slate-200 cursor-pointer overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300"
                        onClick={() => onFolderClick(folder.name)}
                    >
                        <CardContent className="p-0">
                            <div className="flex items-center gap-4 p-6 bg-slate-50/50 group-hover:bg-white transition-colors">
                                <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm transition-transform group-hover:scale-110">
                                    <Folder className="h-6 w-6 fill-current" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight text-sm">{folder.name}</h3>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{folder.description}</p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {currentFolder === 'Quotations' && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    <button
                        onClick={() => onSubFolderClick(null)}
                        className={cn(
                            "px-4 py-1.5 rounded-full text-xs font-bold transition-all border uppercase tracking-wider whitespace-nowrap",
                            !currentSubFolder
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                        )}
                    >
                        All
                    </button>
                    {quotationStatuses.map((status) => (
                        <button
                            key={status}
                            onClick={() => onSubFolderClick(status)}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-xs font-bold transition-all border uppercase tracking-wider whitespace-nowrap",
                                currentSubFolder === status
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                    : "bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                            )}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            )}

            <Card className="border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
                <CardContent className="p-0">
                    <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-3 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <FolderOpen className="h-3.5 w-3.5" />
                            Files in {currentFolder || 'All Categories'} {currentSubFolder ? `> ${currentSubFolder}` : ''}
                        </span>
                        <span className="text-xs font-medium text-slate-400">{files.length} items</span>
                    </div>

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow>
                                    <TableHead className="w-[300px] text-[10px] font-bold uppercase tracking-widest text-slate-500 pl-6">Document Name / ID</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Info</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Client / Lead Details</TableHead>
                                    <TableHead className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Date</TableHead>
                                    <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-slate-500 pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-40 text-center">
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : files.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-40 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <FileText className="h-10 w-10 mb-2 opacity-20" />
                                                <p className="text-sm font-medium">No documents found for this client / folder.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    files.map((file) => {
                                        const client = getClientInfo(file);
                                        return (
                                            <TableRow key={file._id} className="group hover:bg-slate-50/80 transition-all">
                                                <TableCell className="pl-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn(
                                                            "h-10 w-10 rounded-lg flex items-center justify-center shadow-sm shrink-0",
                                                            file.type === 'pdf' ? "bg-rose-50 text-rose-500" :
                                                                ['png', 'jpg', 'jpeg'].includes(file.type) ? "bg-purple-50 text-purple-500" :
                                                                    "bg-blue-50 text-blue-500"
                                                        )}>
                                                            {['png', 'jpg', 'jpeg'].includes(file.type) ? <ImageIcon className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-slate-800 text-sm truncate max-w-[200px]">{file.name}</p>
                                                            {file.subCategory && (
                                                                <span className="text-[9px] font-bold bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                                                    {file.subCategory}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded w-fit">
                                                            {file.type}
                                                        </span>
                                                        <span className="text-[10px] font-medium text-slate-400">{file.size}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {client ? (
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">ID: {client.id}</span>
                                                                <span className="text-xs font-bold text-slate-700">{client.name}</span>
                                                            </div>
                                                            <span className="text-[10px] font-medium text-slate-400 mt-1">{client.email}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] font-medium text-slate-400 italic">No reference linked</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-xs font-medium text-slate-600">{new Date(file.createdAt).toLocaleDateString()}</span>
                                                </TableCell>
                                                <TableCell className="pr-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <div className="flex items-center bg-slate-100/50 rounded-lg p-1 border border-transparent group-hover:bg-white group-hover:border-slate-200 transition-all">
                                                            <a
                                                                href={`${api.defaults.baseURL?.replace('/api', '')}${file.isDynamic ? `/api${file.url.replace('/api', '')}` : file.url}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                title="View"
                                                            >
                                                                <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 px-2.5">
                                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                                    <span className="text-[10px] font-bold uppercase">View</span>
                                                                </Button>
                                                            </a>
                                                            <div className="w-px h-4 bg-slate-200 mx-1" />
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 gap-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 px-2.5"
                                                                onClick={() => handleDownload(file)}
                                                                title="Download"
                                                            >
                                                                <Download className="h-3.5 w-3.5" />
                                                                <span className="text-[10px] font-bold uppercase">Save</span>
                                                            </Button>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-9 w-9 text-slate-300 hover:text-rose-600 hover:bg-rose-50 p-0"
                                                            onClick={() => handleDelete(file._id)}
                                                            title="Delete Permanent"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
