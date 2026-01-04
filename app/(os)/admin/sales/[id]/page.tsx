'use client';

import {
    FileText,
    Send,
    CheckCircle,
    Download,
    Printer,
    MoreHorizontal,
    CreditCard,
    Briefcase
} from 'lucide-react';
import { PageHeader } from '@/components/os/ui/PageHeader';
import { Button } from '@/components/os/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/os/ui/Card';
import { StatusBadge } from '@/components/os/ui/StatusBadge';
import { use, useEffect, useState } from 'react';
import api from '@/lib/axios';
import Link from 'next/link';

export default function SaleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [sale, setSale] = useState<any>(null);
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('MANUAL');

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            // Inefficient but necessary due to Phase 1 limitations (no GET /sales/:id)
            const salesRes = await api.get('/sales');
            const foundSale = salesRes.data.find((s: any) => s._id === id);
            setSale(foundSale);

            // Fetch payments
            const paymentsRes = await api.get('/payments');
            const foundPayments = paymentsRes.data.filter((p: any) => p.saleId?._id === id || p.saleId === id);
            setPayments(foundPayments);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRecordPayment = async () => {
        if (!paymentAmount) return alert("Enter amount");
        try {
            await api.post('/payments', {
                saleId: id,
                amount: Number(paymentAmount),
                method: paymentMethod,
                status: 'SUCCESS'
            });
            setPaymentAmount('');
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
        <div className="space-y-6">
            <PageHeader
                title={`Sale: ${sale.clientReference || 'No Ref'}`}
                description={`Lead: ${lead.name} • Total: $${sale.totalAmount}`}
            >
                <div className="flex gap-2">
                    <StatusBadge status={sale.pendingAmount === 0 ? 'Paid' : 'Pending'} className="h-9 px-4 text-sm" />

                    {/* Create Project Link */}
                    <Link href={`/admin/projects/create?saleId=${id}`}>
                        <Button>
                            <Briefcase className="mr-2 h-4 w-4" />
                            Create Project
                        </Button>
                    </Link>
                </div>
            </PageHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left: Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-t-4 border-t-structura-blue">
                        <CardContent className="p-8 space-y-8">
                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-structura-black">{lead.name}</h2>
                                    <p className="text-slate-500 text-sm mt-1">{lead.email}</p>
                                </div>
                                <div className="text-right">
                                    <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest">Sale</h3>
                                    <p className="text-structura-black font-medium mt-1">#{id.slice(-6)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-8 pt-6">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Total Amount</p>
                                    <p className="font-bold text-structura-black">{sale.currency || sale.quoteId?.currency || '$'} {sale.totalAmount}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Pending Amount</p>
                                    <p className="font-bold text-red-600">{sale.currency || sale.quoteId?.currency || '$'} {sale.pendingAmount}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment History */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Payment History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {payments.length === 0 ? <p className="text-sm text-slate-500">No payments recorded.</p> : (
                                <div className="space-y-2">
                                    {payments.map(p => (
                                        <div key={p._id} className="flex justify-between border-b pb-2 last:border-0">
                                            <span>{new Date(p.date).toLocaleDateString()} - {p.method}</span>
                                            <span className="font-mono font-bold">${p.amount}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Actions */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Record Payment */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Record Payment</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <input
                                type="number"
                                placeholder="Amount"
                                className="w-full border p-2 rounded"
                                value={paymentAmount}
                                onChange={e => setPaymentAmount(e.target.value)}
                            />
                            <select
                                className="w-full border p-2 rounded"
                                value={paymentMethod}
                                onChange={e => setPaymentMethod(e.target.value)}
                            >
                                <option value="MANUAL">Manual</option>
                                <option value="BANK_TRANSFER">Bank Transfer</option>
                                <option value="RAZORPAY">Razorpay</option>
                                <option value="STRIPE">Stripe</option>
                            </select>
                            <Button className="w-full" onClick={handleRecordPayment}>
                                <CreditCard className="mr-2 h-4 w-4" />
                                Record Payment
                            </Button>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
