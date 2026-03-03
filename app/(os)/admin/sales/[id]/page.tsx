'use client';

import {
    FileText,
    Send,
    CheckCircle,
    Download,
    Printer,
    MoreHorizontal,
    CreditCard,
    Briefcase,
    Mail,
    ArrowLeft
} from 'lucide-react';
import { PageHeader } from '@/components/os/ui/PageHeader';
import { Button } from '@/components/os/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/os/ui/Card';
import { StatusBadge } from '@/components/os/ui/StatusBadge';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function SaleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [sale, setSale] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Payment UI states
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentStatusSelect, setPaymentStatusSelect] = useState('pending');

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const res = await api.get(`/sales/${id}`);
            setSale(res.data);
            setPaymentStatusSelect(res.data.paymentStatus);
            // Default next payment amount is the pending amount
            setPaymentAmount(res.data.pendingAmount.toString());
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePayment = async () => {
        if (!paymentAmount && paymentAmount !== '0') return alert("Enter paid amount");
        try {
            await api.put(`/sales/${id}/payment`, {
                paymentStatus: paymentStatusSelect,
                paidAmount: Number(paymentAmount)
            });
            alert("Payment recorded successfully");
            fetchData(); // Refresh
        } catch (error) {
            console.error(error);
            alert("Failed to record payment");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!sale) return <div>Sale not found</div>;

    const lead = sale.quoteId?.leadId || {};

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-20">
            <div className="flex items-center gap-4 mb-2">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-slate-500">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
            </div>

            <PageHeader
                title={`Sale Reference: ${sale.saleId}`}
                description={`Linked Quote: ${sale.quoteId?.quotationId} • Customer: ${lead.name}`}
            >
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}/sales/${sale._id}/invoice`, '_blank')}
                        className="bg-white"
                    >
                        <FileText className="mr-2 h-4 w-4 text-purple-600" />
                        View Invoice
                    </Button>
                    <Button
                        variant="outline"
                        onClick={async () => {
                            if (confirm('Send Invoice email?')) {
                                try {
                                    await api.post(`/sales/${sale._id}/send`);
                                    alert('Invoice sent successfully!');
                                } catch (err) {
                                    alert('Failed to send invoice');
                                }
                            }
                        }}
                    >
                        <Mail className="mr-2 h-4 w-4 text-orange-600" />
                        Email Invoice
                    </Button>
                </div>
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left: Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-t-4 border-t-structura-blue shadow-md">
                        <CardContent className="p-8 space-y-8">
                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-structura-black">{sale.clientReference || lead.name}</h2>
                                    <p className="text-slate-500 text-sm mt-1">{lead.email}</p>
                                </div>
                                <div className="text-right flex flex-col items-end gap-2">
                                    <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest">Sale</h3>
                                    <StatusBadge status={sale.paymentStatus} />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-8 pt-6 border-t border-slate-100">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Total Amount</p>
                                    <p className="text-2xl font-bold text-structura-black">{sale.currency} {sale.totalAmount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Paid Amount</p>
                                    <p className="text-2xl font-bold text-green-600">{sale.currency} {sale.paidAmount.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Pending Amount</p>
                                    <p className="text-2xl font-bold text-red-600">{sale.currency} {sale.pendingAmount.toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Summary of Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base text-slate-700">Line Items</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b">
                                    <tr>
                                        <th className="px-4 py-3 font-medium text-slate-500 text-left">Description</th>
                                        <th className="px-4 py-3 font-medium text-slate-500 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(sale.quoteId?.items || []).map((item: any, i: number) => (
                                        <tr key={i} className="border-b last:border-0 hover:bg-slate-50">
                                            <td className="px-4 py-3">{item.description}</td>
                                            <td className="px-4 py-3 text-right font-medium">{sale.currency} {item.amount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Actions */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Record Payment */}
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader className="bg-slate-50 border-b">
                            <CardTitle className="text-base">Update Payment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <div>
                                <label className="text-sm font-medium text-slate-600 block mb-1">Total Paid So Far</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 font-bold text-slate-400">{sale.currency}</span>
                                    <input
                                        type="number"
                                        className="w-full h-10 border border-slate-300 rounded-md pl-10 pr-3 focus:ring-2 focus:ring-blue-500"
                                        value={paymentAmount}
                                        onChange={e => setPaymentAmount(e.target.value)}
                                        max={sale.totalAmount}
                                        min={0}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-600 block mb-1">Status Override (Optional)</label>
                                <select
                                    className="w-full h-10 border border-slate-300 rounded-md px-3 bg-white focus:ring-2 focus:ring-blue-500"
                                    value={paymentStatusSelect}
                                    onChange={e => setPaymentStatusSelect(e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="partial">Partial</option>
                                    <option value="paid">Paid</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <Button className="w-full mt-2 py-6 bg-slate-800 hover:bg-slate-900" onClick={handleUpdatePayment}>
                                <CreditCard className="mr-2 h-4 w-4" />
                                Save Payment Record
                            </Button>

                            {sale.paymentStatus === 'paid' && sale.clientId && (
                                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800 flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 shrink-0" />
                                    <span>Client Profile has been auto-generated for this paid sale.</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
