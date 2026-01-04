'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/axios';
import { PageHeader } from '@/components/os/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/os/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/os/ui/Tabs';
import { Users, Briefcase, DollarSign, FileText, Mail, Phone, MapPin, Lock, Key, Check } from 'lucide-react';
import { Button } from '@/components/os/ui/Button';

export default function ClientDashboard() {
    const { id } = useParams();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchClientData();
    }, []);

    const fetchClientData = async () => {
        try {
            const res = await api.get(`/clients/${id}`);
            setData(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8">Loading dashboard...</div>;
    if (!data) return <div className="p-8">Client not found</div>;

    const { user, profile, sales, projects, lead } = data;

    // Calc Total Lifetime Value
    const totalSpent = sales.reduce((sum: number, sale: any) => sum + sale.totalAmount, 0);

    return (
        <div className="space-y-6">
            <PageHeader
                title={profile?.companyName || user.name}
                description={`Client Dashboard • ID: ${user.clientId || user.username}`}
            >
                <div className="flex gap-2">
                    <Button variant="outline">Edit Profile</Button>
                    <Button>Create New Project</Button>
                </div>
            </PageHeader>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Lifetime Value</p>
                            <h3 className="text-2xl font-bold mt-1">₹{totalSpent.toLocaleString()}</h3>
                        </div>
                        <div className="p-2 bg-green-100 rounded-full text-green-600"><DollarSign className="h-6 w-6" /></div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Active Projects</p>
                            <h3 className="text-2xl font-bold mt-1">{projects.length}</h3>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-full text-blue-600"><Briefcase className="h-6 w-6" /></div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Total Invoices</p>
                            <h3 className="text-2xl font-bold mt-1">{sales.length}</h3>
                        </div>
                        <div className="p-2 bg-purple-100 rounded-full text-purple-600"><FileText className="h-6 w-6" /></div>
                    </CardContent>
                </Card>
                {/* Add more stats if needed */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left: Contact Info */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Client Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Users className="h-5 w-5 text-slate-400" />
                                <div>
                                    <p className="text-sm font-medium">Primary Contact</p>
                                    <p className="text-slate-600">{profile?.contactPerson || user.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-slate-400" />
                                <div>
                                    <p className="text-sm font-medium">Email</p>
                                    <p className="text-slate-600 text-sm overflow-hidden text-ellipsis">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-slate-400" />
                                <div>
                                    <p className="text-sm font-medium">Phone</p>
                                    <p className="text-slate-600">{profile?.phone || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t">
                                <p className="text-xs text-slate-500 uppercase font-bold mb-2">Original Context</p>
                                <p className="text-sm">Source: <span className="font-medium">{lead?.source || 'Converted Lead'}</span></p>
                                <p className="text-sm">Since: <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span></p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Left: Portal Access Control */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-purple-200">
                        <CardHeader className="bg-purple-50/50 pb-3">
                            <CardTitle className="text-purple-900 flex items-center gap-2">
                                <Lock className="h-4 w-4" /> Portal Access
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">

                            {/* Access Status Indicator */}
                            <div className="flex justify-between items-center text-sm border-b pb-3 border-purple-100">
                                <span className="text-slate-600 font-medium">Portal Status</span>
                                {user ? (
                                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                                        <Check className="h-3 w-3" /> ACTIVE
                                    </span>
                                ) : (
                                    <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-xs font-bold">
                                        NOT GRANTED
                                    </span>
                                )}
                            </div>

                            {user ? (
                                /* Access GRANTED View */
                                <div className="space-y-4">
                                    <div className="bg-slate-50 p-3 rounded-md space-y-2 text-sm border border-slate-100">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Username</span>
                                            <span className="font-mono font-medium">{user.username}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500">Password</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-medium bg-white px-2 rounded border">
                                                    {user.tempPassword || '••••••••'}
                                                </span>
                                            </div>
                                        </div>
                                        {user.tempPassword && (
                                            <p className="text-[10px] text-slate-400 text-right">
                                                *Temp password shown.
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            variant="outline"
                                            className="text-xs"
                                            onClick={() => alert(`Credentials:\nUsername: ${user.username}\nPassword: ${user.tempPassword || 'Hidden'}`)}
                                        >
                                            <Key className="h-3 w-3 mr-1" /> View Full
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="text-xs"
                                            onClick={async () => {
                                                if (!confirm("Resend credentials email to client?")) return;
                                                // Re-trigger generation/sending logic (assuming endpoint handles existing users by resending)
                                                // Or generic "Resend" endpoint. 
                                                // clientController says: "If user exists... generate new temp password". 
                                                // Warning user about password reset might be good.
                                                await api.post(`/clients/${id}/credentials`);
                                                alert("New credentials generated and sent!");
                                                fetchClientData(); // Refresh to see new temp pass
                                            }}
                                        >
                                            <Mail className="h-3 w-3 mr-1" /> Resend
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                /* Access NOT GRANTED View */
                                <div className="space-y-4">
                                    {/* Pre-requisite Checks */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500">Advance Payment</span>
                                            {totalSpent > 0 ? (
                                                <span className="text-green-600 font-bold flex items-center gap-1"><Check className="h-3 w-3" /> Paid</span>
                                            ) : (
                                                <span className="text-red-500 font-medium">Pending</span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500">Agreement</span>
                                            <select
                                                className="h-6 text-[10px] border rounded bg-white"
                                                defaultValue={profile?.agreementStatus || 'PENDING'}
                                                onChange={() => alert("Agreement Mock Update")}
                                            >
                                                <option value="PENDING">Pending</option>
                                                <option value="SIGNED">Signed</option>
                                            </select>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full bg-purple-600 hover:bg-purple-700"
                                        disabled={totalSpent <= 0 && profile?.agreementStatus !== 'SIGNED'} // Strict check, can be overridden by Force
                                        onClick={async () => {
                                            const confirmMsg = totalSpent > 0
                                                ? "Advance Payment Verified. Generate Access?"
                                                : "Warning: No Advance Payment. Force Generate Access?";

                                            if (!confirm(confirmMsg)) return;

                                            try {
                                                await api.post(`/clients/${id}/credentials`, { force: true });
                                                alert("Access Granted! Email sent.");
                                                fetchClientData();
                                            } catch (e: any) {
                                                alert("Error: " + e.message);
                                            }
                                        }}
                                    >
                                        <Key className="h-4 w-4 mr-2" /> Grant Access
                                    </Button>
                                    <p className="text-[10px] text-center text-slate-400">
                                        Generates login & sends email
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right: Tabs */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="sales">
                        <TabsList className="mb-4">
                            <TabsTrigger value="sales">Sales & Invoices</TabsTrigger>
                            <TabsTrigger value="projects">Projects</TabsTrigger>
                            <TabsTrigger value="quotes">Quotations</TabsTrigger>
                        </TabsList>

                        <TabsContent value="sales">
                            <Card>
                                <CardHeader><CardTitle>Sales History</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="text-left bg-slate-50 border-b">
                                                <tr>
                                                    <th className="p-3">Reference</th>
                                                    <th className="p-3">Date</th>
                                                    <th className="p-3">Amount</th>
                                                    <th className="p-3">Pending</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {sales.map((sale: any) => (
                                                    <tr key={sale._id}>
                                                        <td className="p-3 font-medium">{sale.saleNumber || sale._id.slice(-6)}</td>
                                                        <td className="p-3">{new Date(sale.createdAt).toLocaleDateString()}</td>
                                                        <td className="p-3">₹{sale.totalAmount.toLocaleString()}</td>
                                                        <td className="p-3 text-red-600">₹{sale.pendingAmount.toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="projects">
                            <div className="p-8 text-center text-slate-500 border-2 dashed border-slate-200 rounded-xl">
                                No active projects yet.
                            </div>
                        </TabsContent>

                        <TabsContent value="quotes">
                            <div className="p-8 text-center text-slate-500 border-2 dashed border-slate-200 rounded-xl">
                                Quotations will appear here.
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
