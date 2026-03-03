'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { Button } from "@/components/os/ui/Button";
import { Input } from "@/components/os/ui/Input";
import axios from 'axios';

interface UserEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user: any;
    role: 'client' | 'employee' | 'partner';
}

export default function UserEditModal({ isOpen, onClose, onSuccess, user, role }: UserEditModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<any>(user || {});
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const endpoint = `/api/proxy/admin/${role}s/${user._id}`;
            await axios.patch(endpoint, formData);
            setMessage('Updated successfully!');
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1000);
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    const renderFields = () => {
        switch (role) {
            case 'client':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Company Name</label>
                            <Input name="companyName" value={formData.companyName || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Contact Person</label>
                            <Input name="contactPerson" value={formData.contactPerson || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Email</label>
                            <Input name="email" value={formData.email || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Phone</label>
                            <Input name="phone" value={formData.phone || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Industry</label>
                            <Input name="industry" value={formData.industry || ''} onChange={handleChange} />
                        </div>
                    </div>
                );
            case 'employee':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Full Name</label>
                            <Input name="fullName" value={formData.fullName || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Official Email</label>
                            <Input name="officialEmail" value={formData.officialEmail || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Designation</label>
                            <Input name="designation" value={formData.designation || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Department</label>
                            <Input name="department" value={formData.department || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Employee ID</label>
                            <Input name="employeeId" value={formData.employeeId || ''} onChange={handleChange} />
                        </div>
                    </div>
                );
            case 'partner':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Company Name</label>
                            <Input name="companyName" value={formData.companyName || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Contact Person</label>
                            <Input name="contactPerson" value={formData.contactPerson || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Email</label>
                            <Input name="email" value={formData.email || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Partnership Type</label>
                            <Input name="partnershipType" value={formData.partnershipType || ''} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-1 block">Region</label>
                            <Input name="region" value={formData.region || ''} onChange={handleChange} />
                        </div>
                    </div>
                );
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="text-lg font-semibold text-structura-black">Edit {role.charAt(0).toUpperCase() + role.slice(1)}</h3>
                                <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {renderFields()}

                                {message && (
                                    <p className={`text-sm font-medium ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                                        {message}
                                    </p>
                                )}

                                <div className="flex gap-3 justify-end pt-2">
                                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                                    <Button type="submit" disabled={loading} className="btn-fusion min-w-[100px]">
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
