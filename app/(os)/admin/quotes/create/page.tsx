'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/os/ui/PageHeader";
import { Button } from "@/components/os/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/os/ui/Card";
import api from '@/lib/axios';
import { Search, Plus, User, Mail, Phone, Hash, RefreshCcw, Trash2, Zap } from 'lucide-react';
import Link from 'next/link';
import { AddLeadModal } from '@/components/os/crm/AddLeadModal';
import { cn } from "@/lib/utils";

function CreateQuoteContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const leadId = searchParams.get('leadId');
    const cloneId = searchParams.get('cloneId');

    // Core States
    const [isLoading, setIsLoading] = useState(false);

    // Selection States
    const [searchTerm, setSearchTerm] = useState('');
    const [foundLeads, setFoundLeads] = useState<any[]>([]);
    const [selectedLead, setSelectedLead] = useState<any>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    // Quote Data States
    const [currency, setCurrency] = useState('INR');
    const [validityDate, setValidityDate] = useState('');
    const [items, setItems] = useState<any[]>([
        { description: '', pricingType: 'UNIT', quantity: 1, rate: 0, amount: 0 }
    ]);
    const [discountType, setDiscountType] = useState('FLAT');
    const [discountValue, setDiscountValue] = useState(0);
    const [amcAmount, setAmcAmount] = useState(0);
    const [operationalCosts, setOperationalCosts] = useState<any[]>([
        { description: 'Server Cost', amount: 0 },
        { description: 'API Cost', amount: 0 },
        { description: 'Cloud Cost', amount: 0 }
    ]);
    const [clientPaysOperationalCosts, setClientPaysOperationalCosts] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);

    // Effects
    useEffect(() => {
        fetchSuggestions();
        if (cloneId) fetchCloneData(cloneId);
        if (leadId) fetchLeadData(leadId);
    }, [cloneId, leadId]);

    useEffect(() => {
        if (searchTerm.length > 2) {
            const timer = setTimeout(() => searchLeads(searchTerm), 500);
            return () => clearTimeout(timer);
        } else {
            setFoundLeads([]);
        }
    }, [searchTerm]);

    const finalLead = selectedLead;

    // --- API Calls ---

    const fetchCloneData = async (id: string) => {
        try {
            const res = await api.get('/quotes'); // Getting all to find one (inefficient but interim solution)
            const source = res.data.find((q: any) => q._id === id);
            if (source) {
                setCurrency(source.currency || 'INR');
                setItems(Array.isArray(source.items) ? source.items.map((i: any) => ({ ...i, _id: undefined })) : []);
                setDiscountType(source.discountType || 'FLAT');
                setDiscountValue(source.discountValue || 0);
                setAmcAmount(source.amcAmount || 0);
                setOperationalCosts(source.operationalCosts || []);
                setClientPaysOperationalCosts(source.clientPaysOperationalCosts || false);
            }
        } catch (error) {
            console.error("Failed to clone", error);
        }
    };

    const fetchSuggestions = async () => {
        try {
            const res = await api.get('/suggestions'); // Ensure this endpoint exists or mock it
            if (Array.isArray(res.data)) setSuggestions(res.data);
        } catch (error) {
            // console.error("Failed suggestions", error); // Silently fail if endpoint missing
        }
    };

    const fetchLeadData = async (id: string) => {
        setIsLoading(true);
        try {
            const res = await api.get(`/leads/${id}`);
            setSelectedLead(res.data);
        } catch (error) {
            console.error("Failed to fetch lead", error);
        } finally {
            setIsLoading(false);
        }
    };

    const searchLeads = async (term: string) => {
        setIsSearching(true);
        try {
            const res = await api.get(`/leads?search=${term}`);
            setFoundLeads(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSearching(false);
        }
    };

    // --- Actions ---

    const selectLead = (lead: any) => {
        setSelectedLead(lead);
        setSearchTerm('');
        setFoundLeads([]);
        // Clear URL param if present to avoid confusion, but optional
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const targetId = finalLead?._id || leadId;

        if (!targetId) return alert("Please select a Customer first!");

        setIsLoading(true);
        try {
            // Include basic currency calc
            const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
            const totalDiscount = discountType === 'PERCENTAGE' ? (subtotal * discountValue) / 100 : discountValue;
            const grandTotal = Math.max(0, subtotal - totalDiscount);

            await api.post('/quotes', {
                leadId: targetId,
                items,
                currency,
                subtotal,
                discountType,
                discountValue,
                totalDiscount,
                grandTotal,
                validityDate,
                amcAmount,
                operationalCosts,
                clientPaysOperationalCosts
            });
            router.push(`/admin/leads/${targetId}`);
        } catch (error: any) {
            console.error(error);
            alert(`Failed to create quote: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Helpers ---

    const handleAddItem = () => {
        setItems([...items, { description: '', pricingType: 'UNIT', quantity: 1, rate: 0, amount: 0 }]);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index][field] = value;
        if (field === 'quantity' || field === 'rate') {
            newItems[index].amount = newItems[index].quantity * newItems[index].rate;
        }
        setItems(newItems);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const updateOperationalCost = (index: number, field: string, value: any) => {
        const newCosts = [...operationalCosts];
        newCosts[index][field] = value;
        setOperationalCosts(newCosts);
    };

    const addOperationalCost = () => {
        setOperationalCosts([...operationalCosts, { description: '', amount: 0 }]);
    };

    const removeOperationalCost = (index: number) => {
        setOperationalCosts(operationalCosts.filter((_, i) => i !== index));
    };

    const addSuggestion = (suggestion: any) => {
        setItems([...items, {
            description: suggestion.name,
            detail: suggestion.description,
            pricingType: suggestion.defaultPricingType || 'UNIT',
            quantity: 1,
            rate: suggestion.defaultRate || 0,
            amount: (suggestion.defaultRate || 0) * 1
        }]);
    };

    // Calculations
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const totalDiscount = discountType === 'PERCENTAGE' ? (subtotal * discountValue) / 100 : discountValue;
    const grandTotal = Math.max(0, subtotal - totalDiscount);
    const opCostsTotal = operationalCosts.reduce((sum, cost) => sum + (cost.amount || 0), 0);
    const recurringTotal = clientPaysOperationalCosts ? amcAmount : (amcAmount + opCostsTotal);
    const currencySymbols: any = { 'INR': '₹', 'USD': '$', 'EUR': '€', 'AUD': 'A$' };

    // --- RENDER ---

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            <PageHeader
                title="Create Quotation"
                description="Draft a professional proposal for your client."
            >
                {finalLead && (
                    <div className="flex gap-2">
                        <select
                            className="h-10 rounded-md border border-slate-300 bg-white px-3 font-bold"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                        >
                            <option value="INR">INR (₹)</option>
                            <option value="USD">USD ($)</option>
                            <option value="AUD">AUD (A$)</option>
                            <option value="EUR">EUR (€)</option>
                        </select>
                    </div>
                )}
            </PageHeader>

            {/* Loading State */}
            {isLoading && !finalLead && (
                <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                    <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-500 font-medium italic">Fetching lead details...</p>
                </div>
            )}

            {/* STEP 1: SELECT CUSTOMER */}
            {!finalLead && !isLoading && (
                <div className="flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in-95 duration-500">
                    <Card className="w-full max-w-2xl border-blue-200 shadow-xl">
                        <CardHeader className="bg-blue-50/50 border-b border-blue-100 pb-4">
                            <CardTitle className="text-xl text-blue-900 flex items-center gap-2">
                                <User className="h-5 w-5" /> Select Customer
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-600">Search Lead / Customer</label>
                                <div className="relative">
                                    <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                                    <input
                                        className="w-full h-12 rounded-lg border border-slate-300 pl-11 pr-4 text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                                        placeholder="Type Name, Email, Phone or ID..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        autoFocus
                                    />
                                    {/* Search Results Dropdown */}
                                    {foundLeads.length > 0 && (
                                        <div className="absolute top-14 left-0 w-full bg-white shadow-2xl rounded-lg border border-slate-100 z-50 max-h-80 overflow-y-auto divide-y divide-slate-50">
                                            {foundLeads.map(lead => (
                                                <div
                                                    key={lead._id}
                                                    className="p-4 hover:bg-blue-50 cursor-pointer transition-colors group"
                                                    onClick={() => selectLead(lead)}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <div className="font-bold text-slate-800 text-lg group-hover:text-blue-700">{lead.name}</div>
                                                            <div className="text-sm text-slate-500 flex gap-3 mt-1 items-center">
                                                                {lead.leadId || lead.clientId ? (
                                                                    <span className="bg-slate-100 px-2 rounded text-xs py-0.5 font-mono text-slate-600 flex items-center gap-1">
                                                                        <Hash className="h-3 w-3" /> {lead.leadId || lead.clientId}
                                                                    </span>
                                                                ) : null}
                                                                {lead.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {lead.email}</span>}
                                                            </div>
                                                        </div>
                                                        <Button size="sm" variant="outline" className="border-blue-200 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                            Select
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {isSearching && <div className="absolute right-4 top-4 text-xs text-slate-400">Searching...</div>}
                                </div>
                                <p className="text-xs text-slate-400 mt-2 pl-1">
                                    Start typing to see suggestions. Matches Name, Email, Phone, or Lead ID.
                                </p>
                            </div>

                            <div className="pt-6 border-t border-dashed border-slate-200 text-center">
                                <p className="text-sm text-slate-500 mb-2">Customer not found?</p>
                                <Button variant="outline" className="w-full sm:w-auto hover:border-blue-300 hover:text-blue-600" onClick={() => setShowAddModal(true)}>
                                    <Plus className="h-4 w-4 mr-2" /> Create New Lead
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {showAddModal && (
                <AddLeadModal
                    onClose={() => setShowAddModal(false)}
                    onSuccess={(newLead) => {
                        setShowAddModal(false);
                        if (newLead && newLead._id) {
                            selectLead(newLead);
                        } else {
                            searchLeads('');
                        }
                    }}
                />
            )}

            {/* STEP 2: QUOTE FORM */}
            {finalLead && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">

                    {/* Selected Customer Header */}
                    <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl border border-blue-100">
                                {(finalLead.name || 'C').charAt(0)}
                            </div>
                            <div>
                                <div className="font-bold text-lg text-slate-800">{finalLead.name}</div>
                                <div className="text-xs text-slate-500 flex gap-2">
                                    {finalLead.leadId && <span>{finalLead.leadId}</span>}
                                    {finalLead.email && <span>• {finalLead.email}</span>}
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSelectedLead(null);
                                router.replace('/admin/quotes/create');
                            }}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                            Change Customer
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 1. Configuration */}
                        <Card>
                            <CardHeader className="pb-3"><CardTitle className="text-sm uppercase text-slate-500 font-bold tracking-wider">Configuration</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                                    <div className="flex-1 w-full">
                                        <label className="text-sm font-medium mb-1 block text-slate-700">Validity Date</label>
                                        <input
                                            type="date"
                                            required
                                            className="w-full h-10 rounded-md border border-slate-300 px-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={validityDate}
                                            onChange={e => setValidityDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex-1 w-full">
                                        {/* Placeholder for Quick Add - Currently hidden/simplified unless suggestions exist */}
                                        {suggestions.length > 0 && (
                                            <>
                                                <label className="text-sm font-medium mb-1 block text-slate-700">Quick Add from Library</label>
                                                <select
                                                    className="w-full h-10 rounded-md border border-slate-300 px-3 bg-slate-50"
                                                    onChange={(e) => {
                                                        const s = suggestions.find(s => s._id === e.target.value);
                                                        if (s) addSuggestion(s);
                                                        e.target.value = "";
                                                    }}
                                                >
                                                    <option value="">Select a service to add...</option>
                                                    {suggestions.map(s => (
                                                        <option key={s._id} value={s._id}>{s.name}</option>
                                                    ))}
                                                </select>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 2. Line Items */}
                        <Card>
                            <CardHeader><CardTitle>Line Items</CardTitle></CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 text-slate-500 font-medium border-b">
                                            <tr>
                                                <th className="px-4 py-3 w-[40%]">Service Description</th>
                                                <th className="px-4 py-3 w-[15%]">Type</th>
                                                <th className="px-4 py-3 w-[10%]">Qty/Hrs</th>
                                                <th className="px-4 py-3 w-[15%]">Rate</th>
                                                <th className="px-4 py-3 w-[15%] text-right">Amount</th>
                                                <th className="px-4 py-3 w-[5%]"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {items.map((item, index) => (
                                                <tr key={index} className="group hover:bg-slate-50 transition-colors">
                                                    <td className="p-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Service Name..."
                                                            className="w-full border-none bg-transparent focus:ring-0 font-medium placeholder:text-slate-300"
                                                            value={item.description}
                                                            onChange={e => updateItem(index, 'description', e.target.value)}
                                                            required
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="Optional details..."
                                                            className="w-full border-none bg-transparent focus:ring-0 text-xs text-slate-500 placeholder:text-slate-300"
                                                            value={item.detail || ''}
                                                            onChange={e => updateItem(index, 'detail', e.target.value)}
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        <select
                                                            className="w-full border-gray-200 rounded text-xs py-1 bg-transparent focus:ring-blue-500"
                                                            value={item.pricingType}
                                                            onChange={e => updateItem(index, 'pricingType', e.target.value)}
                                                        >
                                                            <option value="UNIT">Unit / Fixed</option>
                                                            <option value="HOURLY">Hourly</option>
                                                        </select>
                                                    </td>
                                                    <td className="p-2">
                                                        <input
                                                            type="number"
                                                            min="0.1" step="0.1"
                                                            className="w-full border-gray-200 rounded py-1 px-2 text-center focus:ring-blue-500 focus:border-blue-500"
                                                            value={item.quantity}
                                                            onChange={e => updateItem(index, 'quantity', Number(e.target.value))}
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        <div className="relative">
                                                            <span className="absolute left-2 top-1.5 text-slate-400">{currencySymbols[currency]}</span>
                                                            <input
                                                                type="number"
                                                                className="w-full border-gray-200 rounded py-1 pl-6 pr-2 text-right focus:ring-blue-500 focus:border-blue-500"
                                                                value={item.rate}
                                                                onChange={e => updateItem(index, 'rate', Number(e.target.value))}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-right font-medium text-slate-700">
                                                        {currencySymbols[currency]} {(item.quantity * item.rate).toLocaleString()}
                                                    </td>
                                                    <td className="p-2 text-center">
                                                        <button type="button" onClick={() => handleRemoveItem(index)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                                                            &times;
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-4 border-t border-slate-100">
                                    <Button type="button" variant="outline" size="sm" onClick={handleAddItem} className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                        <Plus className="h-3 w-3 mr-1" /> Add Line Item
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 2.1 Maintenance & Recurring Costs */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Maintenance Section (Yellow/Amber) */}
                            <Card className="border-amber-100 shadow-sm">
                                <CardHeader className="pb-3 bg-amber-50/50 rounded-t-xl border-b border-amber-100">
                                    <CardTitle className="text-sm uppercase text-amber-700 font-bold tracking-wider flex items-center gap-2">
                                        <RefreshCcw className="h-4 w-4 text-amber-600" /> Maintenance & Support (AMC)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-6">
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-amber-900 flex justify-between items-center">
                                            Annual Maintenance Fee
                                            <span className="text-[10px] text-amber-500 font-normal italic">Yearly Recurring</span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-amber-400 font-medium">{currencySymbols[currency]}</span>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                className="w-full h-11 rounded-lg border border-amber-200 pl-8 pr-4 text-amber-900 font-bold focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white"
                                                value={amcAmount || ""}
                                                onChange={e => setAmcAmount(Number(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                    <p className="text-xs text-amber-600/80 italic leading-relaxed bg-amber-50 p-3 rounded-lg border border-amber-100/50">
                                        Covers software updates, bug fixes, and technical support. Typically 15-20% of project value.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Operational Costs Section (Green/Emerald) */}
                            <Card className="border-emerald-100 shadow-sm">
                                <CardHeader className="pb-3 bg-emerald-50/50 rounded-t-xl border-b border-emerald-100 flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm uppercase text-emerald-700 font-bold tracking-wider flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-emerald-600" /> Operational Costs
                                    </CardTitle>
                                    <Button type="button" variant="outline" size="sm" onClick={addOperationalCost} className="h-7 text-[10px] border-emerald-200 text-emerald-700 hover:bg-emerald-100 bg-white font-bold">
                                        <Plus className="h-3 w-3 mr-1" /> Add Cost
                                    </Button>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="flex items-center justify-between mb-4 p-2 bg-slate-50 rounded-lg border border-slate-100">
                                        <span className="text-[11px] font-bold text-slate-600">Client pays providers directly?</span>
                                        <button
                                            type="button"
                                            onClick={() => setClientPaysOperationalCosts(!clientPaysOperationalCosts)}
                                            className={cn(
                                                "relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none",
                                                clientPaysOperationalCosts ? "bg-emerald-500" : "bg-slate-300"
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                                                    clientPaysOperationalCosts ? "translate-x-5" : "translate-x-1"
                                                )}
                                            />
                                        </button>
                                    </div>

                                    <div className="space-y-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                                        {operationalCosts.map((cost, idx) => (
                                            <div key={idx} className="flex gap-2 items-start group">
                                                <div className="flex-1">
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Server hosting"
                                                        className="w-full h-9 rounded-lg border border-emerald-100 px-3 text-xs focus:ring-1 focus:ring-emerald-500 bg-white"
                                                        value={cost.description}
                                                        onChange={e => updateOperationalCost(idx, 'description', e.target.value)}
                                                    />
                                                </div>
                                                <div className="w-28 relative">
                                                    <span className="absolute left-2.5 top-2 text-emerald-400 text-[10px]">{currencySymbols[currency]}</span>
                                                    <input
                                                        type="number"
                                                        placeholder="0"
                                                        className="w-full h-9 rounded-lg border border-emerald-100 pl-6 pr-2 text-xs font-bold text-right focus:ring-1 focus:ring-emerald-500 bg-white"
                                                        value={cost.amount || ""}
                                                        onChange={e => updateOperationalCost(idx, 'amount', Number(e.target.value))}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeOperationalCost(idx)}
                                                    className="h-9 w-6 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                        {operationalCosts.length === 0 && (
                                            <p className="text-center py-4 text-[10px] text-slate-400 italic">No operational costs added.</p>
                                        )}
                                    </div>

                                    {clientPaysOperationalCosts && opCostsTotal > 0 && (
                                        <div className="mt-2 p-2 bg-blue-50 border border-blue-100 rounded-lg">
                                            <p className="text-[10px] text-blue-700 leading-tight">
                                                * These costs will be listed as client's responsibility and not included in Assuvar's recurring total.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* 3. Summary & Totals */}
                        <div className="flex justify-end">
                            <Card className="w-full md:w-1/3 border-slate-200 shadow-md">
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Subtotal</span>
                                        <span className="font-medium text-slate-700">{currencySymbols[currency]} {subtotal.toLocaleString()}</span>
                                    </div>

                                    <div className="flex justify-between items-center text-sm gap-4">
                                        <span className="text-slate-500">Discount</span>
                                        <div className="flex gap-2 w-48">
                                            <select
                                                className="h-8 text-xs border rounded bg-slate-50 focus:ring-blue-500"
                                                value={discountType}
                                                onChange={e => setDiscountType(e.target.value)}
                                            >
                                                <option value="FLAT">Flat</option>
                                                <option value="PERCENTAGE">%</option>
                                            </select>
                                            <input
                                                type="number"
                                                className="h-8 border rounded px-2 w-full text-right focus:ring-blue-500 font-bold"
                                                value={discountValue}
                                                onChange={e => setDiscountValue(Number(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                    {totalDiscount > 0 && (
                                        <div className="text-right text-xs text-red-500 font-medium">-{currencySymbols[currency]} {totalDiscount.toLocaleString()}</div>
                                    )}

                                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                        <span className="font-bold text-lg text-slate-800">One-time Setup</span>
                                        <span className="font-bold text-2xl text-blue-700">{currencySymbols[currency]} {grandTotal.toLocaleString()}</span>
                                    </div>

                                    {(amcAmount > 0 || opCostsTotal > 0) && (
                                        <div className="pt-4 border-t border-slate-100 mt-2 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-800">Annual Recurring</span>
                                                    <span className="text-[10px] text-slate-500 italic">To Assuvar</span>
                                                </div>
                                                <span className="text-xl font-bold text-amber-600">{currencySymbols[currency]} {recurringTotal.toLocaleString()}</span>
                                            </div>

                                            {clientPaysOperationalCosts && opCostsTotal > 0 && (
                                                <div className="flex justify-between items-center pt-2 border-t border-dotted border-slate-200">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-emerald-700">Client Direct Pay</span>
                                                        <span className="text-[9px] text-slate-400">Paid to providers</span>
                                                    </div>
                                                    <span className="text-sm font-bold text-emerald-600">{currencySymbols[currency]} {opCostsTotal.toLocaleString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 pb-10 border-t pt-6">
                            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" isLoading={isLoading} className="px-8 py-6 text-lg shadow-lg shadow-blue-200 hover:shadow-xl transition-all">
                                Generate Quote
                            </Button>
                        </div>

                    </form>
                </div>
            )
            }
        </div >
    );
}

export default function CreateQuotePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreateQuoteContent />
        </Suspense>
    );
}
