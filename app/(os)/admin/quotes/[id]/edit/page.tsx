'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/os/ui/PageHeader";
import { Button } from "@/components/os/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/os/ui/Card";
import api from '@/lib/axios';
import { Plus, Trash2, Save, ArrowLeft, RefreshCcw, Zap } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function EditQuotePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Data States
    const [quotationId, setQuotationId] = useState('');
    const [lead, setLead] = useState<any>(null);

    const [currency, setCurrency] = useState('INR');
    const [validityDate, setValidityDate] = useState('');
    const [items, setItems] = useState<any[]>([]);
    const [discountType, setDiscountType] = useState('FLAT');
    const [discountValue, setDiscountValue] = useState(0);
    const [amcAmount, setAmcAmount] = useState(0);
    const [operationalCosts, setOperationalCosts] = useState<any[]>([]);
    const [clientPaysOperationalCosts, setClientPaysOperationalCosts] = useState(false);
    const [suggestions, setSuggestions] = useState<any[]>([]);

    useEffect(() => {
        fetchQuote();
        fetchSuggestions();
    }, [id]);

    const fetchQuote = async () => {
        try {
            // Using list fetch workaround until GET /:id is confirmed/added
            const res = await api.get('/quotes');
            const quote = res.data.find((q: any) => q._id === id);

            if (quote) {
                setQuotationId(quote.quotationId || quote.quoteNumber || quote._id.substring(quote._id.length - 6).toUpperCase());
                setLead(quote.leadId); // Assuming populated
                setCurrency(quote.currency || 'INR');
                setValidityDate(quote.validityDate ? new Date(quote.validityDate).toISOString().split('T')[0] : '');

                // Ensure items structure
                setItems(quote.items?.map((i: any) => ({
                    description: i.description || '',
                    detail: i.detail || '',
                    pricingType: i.pricingType || 'UNIT',
                    quantity: i.quantity || 1,
                    rate: i.rate || 0,
                    amount: i.amount || 0
                })) || []);

                setDiscountType(quote.discountType || 'FLAT');
                setDiscountValue(quote.discountValue || 0);
                setAmcAmount(quote.amcAmount || 0);
                setOperationalCosts(quote.operationalCosts || []);
                setClientPaysOperationalCosts(quote.clientPaysOperationalCosts || false);
            } else {
                alert("Quote not found");
                router.push('/admin/quotes');
            }
        } catch (error) {
            console.error("Failed to fetch quote", error);
            alert("Failed to load quote details");
        }
    };

    const fetchSuggestions = async () => {
        try {
            const res = await api.get('/suggestions');
            if (Array.isArray(res.data)) setSuggestions(res.data);
        } catch (error) {
            // console.error(error);
        }
    };

    // --- Logic Same as Create Page ---

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

    // Updated logic: if client pays directly, operational costs don't add to Assuvar's recurring total
    const opCostsTotal = operationalCosts.reduce((sum, cost) => sum + (cost.amount || 0), 0);
    const recurringTotal = amcAmount + (clientPaysOperationalCosts ? 0 : opCostsTotal);

    const currencySymbols: any = { 'INR': '₹', 'USD': '$', 'EUR': '€', 'AUD': 'A$' };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.put(`/quotes/${id}`, {
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
            alert("Quote updated successfully!");
            router.push('/admin/quotes');
        } catch (error: any) {
            console.error(error);
            alert(`Failed to update: ${error.response?.data?.message || 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            <div className="flex items-center gap-4 mb-2">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-slate-500">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
            </div>

            <PageHeader
                title="Edit Quotation"
                description={`Reference: #${quotationId}`}
            >
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
            </PageHeader>

            {/* Customer Header (ReadOnly in Edit) */}
            {lead && (
                <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl border border-blue-100">
                            {(lead.name || 'C').charAt(0)}
                        </div>
                        <div>
                            <div className="font-bold text-lg text-slate-800">{lead.name}</div>
                            <div className="text-xs text-slate-500 flex gap-2">
                                {lead.leadId && <span>{lead.leadId}</span>}
                                {lead.email && <span>• {lead.email}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                        <Save className="h-4 w-4 mr-2" /> Save Changes
                    </Button>
                </div>

            </form>
        </div>
    );
}
