'use client';

import { useState, useEffect } from 'react';
import { DollarSign, FileText, ShoppingCart } from 'lucide-react';
import { PageHeader } from '@/components/os/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/os/ui/Card';
import { StatusBadge } from '@/components/os/ui/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/os/ui/Tabs';
import api from '@/lib/axios';
import { formatDate } from '@/lib/utils';

export default function ClientDashboard() {
    const [quotes, setQuotes] = useState<any[]>([]);
    const [sales, setSales] = useState<any[]>([]);
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/portal/dashboard');
            // Portal API returns { quotes, invoices, payments, stats, etc }
            setQuotes(res.data.quotes || []);
            setSales(res.data.invoices || []);
            setPayments(res.data.payments || []);
        } catch (error) {
            console.error("Failed to fetch client data", error);
        } finally {
            setLoading(false);
        }
    };

    const pendingPayments = sales.reduce((acc, curr) => acc + (curr.pendingAmount || 0), 0);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Client Portal"
                description="View your quotes, invoices, and payment history."
            />

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Active Quotes</p>
                            <p className="text-lg font-bold text-structura-black">{quotes.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                            <ShoppingCart className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Purchased Services</p>
                            <p className="text-lg font-bold text-structura-black">{sales.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive">
                            <DollarSign className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Pending Payments</p>
                            <p className="text-lg font-bold text-structura-black">${pendingPayments}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="quotes" className="w-full">
                <TabsList>
                    <TabsTrigger value="quotes">My Quotes</TabsTrigger>
                    <TabsTrigger value="invoices">My Invoices (Sales)</TabsTrigger>
                    <TabsTrigger value="payments">Payment History</TabsTrigger>
                </TabsList>

                <TabsContent value="quotes" className="space-y-4">
                    <Card>
                        <CardHeader><CardTitle className="text-base">Recent Quotes</CardTitle></CardHeader>
                        <CardContent>
                            {loading ? <p>Loading...</p> : quotes.length === 0 ? <p className="text-slate-500">No quotes found.</p> : (
                                <div className="space-y-4">
                                    {quotes.map((quote) => (
                                        <div key={quote._id} className="flex justify-between items-center border-b last:border-0 pb-4 last:pb-0">
                                            <div>
                                                <p className="font-semibold text-structura-black">{quote.serviceDescription}</p>
                                                <p className="text-sm text-slate-500">Valid until: {formatDate(quote.validityDate)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-structura-black">${quote.amount}</p>
                                                <StatusBadge status={quote.status} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="invoices">
                    <Card>
                        <CardHeader><CardTitle className="text-base">Invoices & Active Services</CardTitle></CardHeader>
                        <CardContent>
                            {loading ? <p>Loading...</p> : sales.length === 0 ? <p className="text-slate-500">No active services.</p> : (
                                <div className="space-y-4">
                                    {sales.map((sale) => (
                                        <div key={sale._id} className="flex justify-between items-center border-b last:border-0 pb-4 last:pb-0">
                                            <div>
                                                <p className="font-semibold text-structura-black">{sale.quoteId?.serviceDescription || 'Service'}</p>
                                                <p className="text-sm text-slate-500">Ref: {sale.clientReference || 'N/A'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-structura-black">${sale.totalAmount}</p>
                                                <p className="text-xs text-slate-500">Paid: ${sale.paidAmount} / Pending: ${sale.pendingAmount}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="payments">
                    <Card>
                        <CardHeader><CardTitle className="text-base">Payment History</CardTitle></CardHeader>
                        <CardContent>
                            {loading ? <p>Loading...</p> : payments.length === 0 ? <p className="text-slate-500">No payments recorded.</p> : (
                                <div className="space-y-4">
                                    {payments.map((payment) => (
                                        <div key={payment._id} className="flex justify-between items-center border-b last:border-0 pb-4 last:pb-0">
                                            <div>
                                                <p className="font-semibold text-structura-black">Transaction: {payment.transactionId}</p>
                                                <p className="text-sm text-slate-500">Date: {formatDate(payment.createdAt)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-structura-black">${payment.amount}</p>
                                                <StatusBadge status={payment.status} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
