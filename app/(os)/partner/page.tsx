'use client';

import { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/os/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/os/ui/Card';
import { StatusBadge } from '@/components/os/ui/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/os/ui/Tabs';
import api from '@/lib/axios';
import { formatDate } from '@/lib/utils';

export default function PartnerDashboard() {
    const [leads, setLeads] = useState<any[]>([]);
    const [sales, setSales] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Backend filters Leads by 'source' matching partner, and Sales derived from those leads
            const [leadRes, saleRes] = await Promise.all([
                api.get('/leads'),
                api.get('/sales')
            ]);
            setLeads(leadRes.data);
            setSales(saleRes.data);
        } catch (error) {
            console.error("Failed to fetch partner data", error);
        } finally {
            setLoading(false);
        }
    };

    const totalRevenue = sales.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
    // Rough estimate of commission (e.g., 10%) - this logic should ideally be backend derived but for display we can estimate
    const estCommission = totalRevenue * 0.10;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Partner Portal"
                description="Track your referrals and commissions."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <Users className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Total Referrals</p>
                            <p className="text-lg font-bold text-structura-black">{leads.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Successful Sales</p>
                            <p className="text-lg font-bold text-structura-black">{sales.length}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6 flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                            <DollarSign className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Attributed Revenue</p>
                            <p className="text-lg font-bold text-structura-black">${totalRevenue}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="leads" className="w-full">
                <TabsList>
                    <TabsTrigger value="leads">My Referrals</TabsTrigger>
                    <TabsTrigger value="sales">Attributed Sales</TabsTrigger>
                </TabsList>

                <TabsContent value="leads">
                    <Card>
                        <CardHeader><CardTitle className="text-base">Referral Status</CardTitle></CardHeader>
                        <CardContent>
                            {loading ? <p>Loading...</p> : leads.length === 0 ? <p className="text-slate-500">No referrals found.</p> : (
                                <div className="space-y-4">
                                    {leads.map((lead) => (
                                        <div key={lead._id} className="flex justify-between items-center border-b last:border-0 pb-4 last:pb-0">
                                            <div>
                                                <p className="font-semibold text-structura-black">{lead.name}</p>
                                                <p className="text-sm text-slate-500">{lead.email}</p>
                                            </div>
                                            <div className="text-right">
                                                <StatusBadge status={lead.status} />
                                                <p className="text-xs text-slate-400 mt-1">{formatDate(lead.createdAt)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="sales">
                    <Card>
                        <CardHeader><CardTitle className="text-base">Sales from Referrals</CardTitle></CardHeader>
                        <CardContent>
                            {loading ? <p>Loading...</p> : sales.length === 0 ? <p className="text-slate-500">No sales yet.</p> : (
                                <div className="space-y-4">
                                    {sales.map((sale) => (
                                        <div key={sale._id} className="flex justify-between items-center border-b last:border-0 pb-4 last:pb-0">
                                            <div>
                                                <p className="font-semibold text-structura-black">{sale.quoteId?.serviceDescription || 'Service'}</p>
                                                <p className="text-sm text-slate-500">Client Ref: {sale.clientReference}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-structura-black">${sale.totalAmount}</p>
                                                <p className="text-xs text-green-600 font-medium">Est. Comm: ${sale.totalAmount * 0.1}</p>
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
