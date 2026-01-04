'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/os/ui/PageHeader";
import { Button } from "@/components/os/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/os/ui/Card";
import api from '@/lib/axios';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';

export default function EditQuotePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Data States
    const [quoteNumber, setQuoteNumber] = useState('');
    const [lead, setLead] = useState<any>(null);

    const [currency, setCurrency] = useState('INR');
    const [validityDate, setValidityDate] = useState('');
    const [items, setItems] = useState<any[]>([]);
    const [discountType, setDiscountType] = useState('FLAT');
    const [discountValue, setDiscountValue] = useState(0);
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
                setQuoteNumber(quote.quoteNumber || quote._id.substring(quote._id.length - 6).toUpperCase());
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
                validityDate
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
                description={`Reference: #${quoteNumber}`}
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
                                        className="h-8 border rounded px-2 w-full text-right focus:ring-blue-500"
                                        value={discountValue}
                                        onChange={e => setDiscountValue(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                            {totalDiscount > 0 && (
                                <div className="text-right text-xs text-red-500 font-medium">-{currencySymbols[currency]} {totalDiscount.toLocaleString()}</div>
                            )}

                            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                <span className="font-bold text-lg text-slate-800">Total</span>
                                <span className="font-bold text-2xl text-blue-700">{currencySymbols[currency]} {grandTotal.toLocaleString()}</span>
                            </div>
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
