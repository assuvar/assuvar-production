'use client';

import { useState } from 'react';
import {
    Dialog, DialogContent,
    DialogHeader, DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/os/ui/Dialog";
import { Button } from "@/components/os/ui/Button";
import { Input } from "@/components/os/ui/Input";
import {
    Select, SelectContent,
    SelectItem, SelectTrigger,
    SelectValue
} from "@/components/os/ui/Select";
import { Upload, X, FileUp, CheckCircle2 } from "lucide-react";
import api from '@/lib/axios';

interface UploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUploadSuccess: () => void;
    defaultCategory?: string | null;
    defaultSubCategory?: string | null;
}

const categories = ['Quotations', 'Sales', 'Advance Receipts', 'Invoices', 'Pay Slips', 'Agreements', 'Others'];
const quotationSubCategories = ['Draft', 'Sent', 'Accepted', 'Rejected', 'Revised'];

export function UploadDialog({ open, onOpenChange, onUploadSuccess, defaultCategory, defaultSubCategory }: UploadDialogProps) {
    const [file, setFile] = useState<File | null>(null);
    const [category, setCategory] = useState<string>(defaultCategory || categories[0]);
    const [subCategory, setSubCategory] = useState<string | null>(defaultSubCategory || null);
    const [name, setName] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            if (!name) setName(selectedFile.name);
        }
    };

    const handleUpload = async () => {
        if (!file || !category) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);
        if (subCategory) formData.append('subCategory', subCategory);
        formData.append('name', name || file.name);

        try {
            await api.post('/documents/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onUploadSuccess();
            onOpenChange(false);
            setFile(null);
            setName('');
        } catch (error) {
            alert("Upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                        <FileUp className="h-5 w-5 text-indigo-600" />
                        Upload Document
                    </DialogTitle>
                    <DialogDescription>
                        Select a file to upload and assign it to a category.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Category Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Folder</label>
                            <Select value={category} onValueChange={(val) => {
                                setCategory(val);
                                if (val !== 'Quotations') setSubCategory(null);
                            }}>
                                <SelectTrigger className="font-medium text-slate-700 h-11">
                                    <SelectValue placeholder="Select folder" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => (
                                        <SelectItem key={cat} value={cat} className="font-medium">{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {category === 'Quotations' && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-300">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status Folder</label>
                                <Select value={subCategory || ''} onValueChange={setSubCategory}>
                                    <SelectTrigger className="font-medium text-slate-700 h-11">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {quotationSubCategories.map(sc => (
                                            <SelectItem key={sc} value={sc} className="font-medium">{sc}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    {/* File Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select File</label>
                        {!file ? (
                            <div
                                onClick={() => document.getElementById('file-upload')?.click()}
                                className="border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group"
                            >
                                <Upload className="h-10 w-10 text-slate-300 group-hover:text-indigo-500 transition-colors mb-4" />
                                <p className="text-sm font-semibold text-slate-500 group-hover:text-indigo-600 transition-colors">Click to browse files</p>
                                <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest">PDF, Images, or ZIP</p>
                                <input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl border border-indigo-100 ring-2 ring-indigo-500/10">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                                    <div>
                                        <p className="text-sm font-bold text-indigo-900 line-clamp-1">{file.name}</p>
                                        <p className="text-[10px] font-medium text-indigo-600 uppercase">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="h-8 w-8 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100 p-0">
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Document Name */}
                    {file && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Display Name</label>
                            <Input
                                placeholder="Rename document (optional)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-11 font-medium"
                            />
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="bg-indigo-600 hover:bg-indigo-700 shadow-md h-10 px-8"
                    >
                        {uploading ? 'Uploading...' : 'Upload Now'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
