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
    ArrowLeft,
    Play,
    Users,
    ReceiptText,
    View,
    Clock,
} from 'lucide-react';
import { PageHeader } from '@/components/os/ui/PageHeader';
import { Button } from '@/components/os/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/os/ui/Card';
import { StatusBadge } from '@/components/os/ui/StatusBadge';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

import { formatDate } from '@/lib/utils';

export default function SaleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [sale, setSale] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Project Initiation states
    const [employees, setEmployees] = useState<any[]>([]);
    const [projectForm, setProjectForm] = useState({
        name: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        assignedStaff: [] as string[]
    });
    const [initiating, setInitiating] = useState(false);
    const [activeProjectObj, setActiveProjectObj] = useState<any>(null);

    // Advance Receipt state
    const [receiptAmount, setReceiptAmount] = useState('');
    const [receiptGenerated, setReceiptGenerated] = useState(false);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const res = await api.get(`/sales/${id}`);
            const saleData = res.data;
            setSale(saleData);

            // Derive generation states from payment history
            const hasAdvancePayment = saleData.payments?.some((p: any) => p.note?.includes("Advance Receipt"));
            if (hasAdvancePayment) setReceiptGenerated(true);

            // Default advance receipt amount
            setReceiptAmount((saleData.totalAmount / 2).toString());

            // Default Project Name
            if (res.data.clientReference) {
                setProjectForm(prev => ({ ...prev, name: `Implementation: ${res.data.clientReference}` }));
            }

            // Fetch Employees for Assignment
            const empRes = await api.get('/admin/employees');
            setEmployees(empRes.data);

            // Fetch Linked Project Details if exists
            if (res.data.projectId) {
                try {
                    const pRes = await api.get('/projects');
                    const fullProj = pRes.data.find((p: any) => p._id === res.data.projectId);
                    setActiveProjectObj(fullProj);
                } catch (e) {
                    console.error("Could not fetch project info", e);
                }
            }

        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePayment = async (amount: number, note: string) => {
        try {
            await api.put(`/sales/${id}/payment`, {
                paymentStatus: 'partial',
                paidAmount: amount,
                note: note
            });
            await fetchData(); // Refresh labels
            return true;
        } catch (error) {
            console.error(error);
            alert("Failed to record payment. Please check your connection.");
            return false;
        }
    };

    const handleUpdateProject = async (updatedFields: any) => {
        if (!sale.projectId) return;
        try {
            await api.put(`/projects/${sale.projectId}`, updatedFields);
            // Refresh project data
            const pRes = await api.get('/projects');
            const fullProj = pRes.data.find((p: any) => p._id === sale.projectId);
            setActiveProjectObj(fullProj);
        } catch (error) {
            console.error("Error updating project", error);
            alert("Failed to update project details.");
        }
    };

    const handleInitiateProject = async () => {
        if (!projectForm.name) return alert("Please enter a Project Name");
        if (!projectForm.endDate) return alert("Please select an End Date");

        if (!confirm(`Do you confirm you want to INITIATE this project: "${projectForm.name}"?`)) return;

        setInitiating(true);
        try {
            const res = await api.post('/projects', {
                saleId: id,
                name: projectForm.name,
                startDate: projectForm.startDate,
                endDate: projectForm.endDate,
                assignedStaff: projectForm.assignedStaff
            });
            alert("Project successfully initiated!");
            fetchData(); // Refresh sale to get linked projectId
        } catch (error) {
            console.error(error);
            alert("Failed to initiate project.");
        } finally {
            setInitiating(false);
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
                    {sale.paymentStatus !== 'paid' && (
                        <div className="flex items-center text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200 mr-2">
                            Final Invoice Locked Until Fully Paid
                        </div>
                    )}
                    <Button
                        variant="outline"
                        onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}/sales/${sale._id}/invoice`, '_blank')}
                        className="bg-white"
                        disabled={sale.paymentStatus !== 'paid'}
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
                        disabled={sale.paymentStatus !== 'paid'}
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

                    {/* Step 1: Advance Receipt */}
                    {sale.paymentStatus !== 'paid' && (
                        <Card className="border-t-4 border-t-blue-500 shadow-md">
                            <CardHeader className="bg-slate-50 border-b pb-4">
                                <CardTitle className="text-lg flex items-center text-structura-black">
                                    <span className="bg-blue-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs mr-3">1</span>
                                    <ReceiptText className="h-5 w-5 mr-2 text-blue-500" /> Advance Receipt Generator
                                </CardTitle>
                                <p className="text-sm text-slate-500 font-normal">Generate and email an official advance payment request to the client.</p>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <div>
                                    <label className="text-sm font-medium text-slate-600 block mb-1">Receipt Target Amount</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 font-bold text-slate-400">{sale.currency || '$'}</span>
                                        <input
                                            type="number"
                                            className="w-full h-10 border border-slate-300 rounded-md pl-10 pr-3 focus:ring-2 focus:ring-blue-500"
                                            value={receiptAmount}
                                            onChange={e => setReceiptAmount(e.target.value)}
                                            max={sale.totalAmount}
                                        />
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1">Defaults to 50% of Total ({sale.totalAmount.toLocaleString()})</p>
                                </div>

                                <div className="flex flex-col gap-4 pt-2">
                                    <Button
                                        className="w-full bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 py-6"
                                        disabled={receiptGenerated}
                                        onClick={async () => {
                                            if (confirm(`Do you confirm you want to GENERATE the Advance Receipt for ${sale.currency} ${receiptAmount}? This will record payment in the system.`)) {
                                                const success = await handleUpdatePayment(Number(receiptAmount), `Advance Receipt Generated (${receiptAmount})`);
                                                if (success) {
                                                    setReceiptGenerated(true);
                                                    alert("Receipt generated and payment recorded! You can now Preview or Email it.");
                                                }
                                            }
                                        }}
                                    >
                                        <ReceiptText className="h-5 w-5 mr-2" />
                                        {receiptGenerated ? '1. Receipt Data Recorded ✅' : '1. Generate Receipt & Record Payment'}
                                    </Button>

                                    <div className="flex gap-4">
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                                            disabled={!receiptGenerated}
                                            onClick={() => {
                                                window.open(`${process.env.NEXT_PUBLIC_API_URL}/sales/${sale._id}/advance-receipt?amount=${receiptAmount}`, '_blank');
                                            }}
                                        >
                                            <View className="h-4 w-4 mr-2" /> 2. Preview PDF
                                        </Button>
                                        <Button
                                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                                            disabled={!receiptGenerated}
                                            onClick={async () => {
                                                if (confirm(`Do you confirm you want to EMAIL the Advance Receipt for ${sale.currency} ${receiptAmount} to the client?`)) {
                                                    try {
                                                        await api.post(`/sales/${sale._id}/advance-receipt/send`, { amount: receiptAmount });
                                                        alert('Advance receipt emailed successfully!');
                                                    } catch (error) {
                                                        alert('Failed to send email');
                                                    }
                                                }
                                            }}
                                        >
                                            <Mail className="h-4 w-4 mr-2" /> 3. Email Client
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right: Steps & History */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Step 2: Project Initiation / Linkage */}
                    {sale.projectId ? (
                        <Card className="border-t-4 border-t-green-500 bg-green-50/30 shadow-sm border-2">
                            <CardHeader className="bg-green-50 border-b pb-4">
                                <CardTitle className="text-lg flex items-center text-green-900 font-bold">
                                    <span className="bg-green-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs mr-3">2</span>
                                    <Briefcase className="h-5 w-5 mr-2 text-green-600" /> Project Active
                                </CardTitle>
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-green-700 text-sm font-medium">{activeProjectObj?.name || 'Loading...'}</p>
                                    <StatusBadge status={activeProjectObj?.status === 'COMPLETED' ? 'paid' : 'partial'} label={activeProjectObj?.status} />
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <Button onClick={() => router.push(`/admin/projects/${sale.projectId}`)} className="w-full bg-green-600 hover:bg-green-700 py-6">
                                    Open Project Workspace
                                </Button>

                                {activeProjectObj && (
                                    <div className="space-y-4">
                                        {/* Visual Timeline */}
                                        <div className="pt-2">
                                            <p className="text-xs uppercase font-bold text-slate-400 mb-2">Project Execution Timeline</p>
                                            <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <div
                                                    className="absolute left-0 top-0 h-full bg-green-500 rounded-full transition-all duration-1000"
                                                    style={{ width: activeProjectObj.status === 'COMPLETED' ? '100%' : '50%' }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                                <span>Start: {formatDate(activeProjectObj.startDate)}</span>
                                                <span className={activeProjectObj.status === 'COMPLETED' ? 'text-green-600' : ''}>Target: {formatDate(activeProjectObj.endDate)}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 bg-white/60 rounded-lg p-3 border border-green-100">
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Staff Assigned</p>
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {activeProjectObj.assignedStaff?.length > 0 ? (
                                                        activeProjectObj.assignedStaff.map((staffId: string) => {
                                                            const emp = employees.find(e => e._id === staffId);
                                                            return emp ? (
                                                                <div key={staffId} className="px-2 py-1 bg-blue-100 rounded-md text-[10px] font-bold text-blue-700 border border-blue-200 flex items-center">
                                                                    {emp.name}
                                                                </div>
                                                            ) : null;
                                                        })
                                                    ) : (
                                                        <span className="text-xs text-slate-500 italic">No staff assigned</span>
                                                    )}
                                                </div>

                                                {/* Staff Quick Selector */}
                                                <div className="border rounded-md p-2 bg-white/40 max-h-32 overflow-y-auto space-y-1">
                                                    {employees.map(emp => (
                                                        <label key={emp._id} className="flex items-center space-x-2 p-1 hover:bg-white/60 rounded cursor-pointer text-[10px]">
                                                            <input
                                                                type="checkbox"
                                                                className="rounded text-green-600"
                                                                checked={activeProjectObj.assignedStaff?.includes(emp._id)}
                                                                onChange={(e) => {
                                                                    let newStaff = [...(activeProjectObj.assignedStaff || [])];
                                                                    if (e.target.checked) {
                                                                        newStaff.push(emp._id);
                                                                    } else {
                                                                        newStaff = newStaff.filter(id => id !== emp._id);
                                                                    }
                                                                    handleUpdateProject({ assignedStaff: newStaff });
                                                                }}
                                                            />
                                                            <span className="text-slate-600">{emp.name}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className={`border-t-4 border-t-purple-500 shadow-md ${(!receiptGenerated && sale.paidAmount === 0) ? 'opacity-60 saturate-50' : ''}`}>
                            <CardHeader className="bg-slate-50 border-b pb-4">
                                <CardTitle className="text-lg flex items-center text-structura-black">
                                    <span className="bg-purple-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs mr-3">2</span>
                                    <Play className="h-5 w-5 mr-2 text-purple-500" /> Step 2: Project Initiation
                                </CardTitle>
                                {(!receiptGenerated && sale.paidAmount === 0) ? (
                                    <p className="text-xs text-amber-600 font-bold bg-amber-50 p-2 rounded mt-2 border border-amber-100">
                                        Locked: Complete Step 1 (Advance Receipt) first.
                                    </p>
                                ) : (
                                    <p className="text-sm text-slate-500 font-normal mt-1">Initial payment received. Transition to an active project.</p>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                <fieldset disabled={!receiptGenerated && sale.paidAmount === 0} className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-slate-600 block mb-1">Project Name</label>
                                        <input
                                            type="text"
                                            className="w-full h-10 border border-slate-300 rounded-md px-3 focus:ring-2 focus:ring-purple-500"
                                            value={projectForm.name}
                                            onChange={e => setProjectForm(prev => ({ ...prev, name: e.target.value }))}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-medium text-slate-600 block mb-1">Start Date</label>
                                            <input
                                                type="date"
                                                className="w-full h-10 border border-slate-300 rounded-md px-3 focus:ring-2 focus:ring-purple-500"
                                                value={projectForm.startDate}
                                                onChange={e => setProjectForm(prev => ({ ...prev, startDate: e.target.value }))}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-600 block mb-1">Target End</label>
                                            <input
                                                type="date"
                                                className="w-full h-10 border border-slate-300 rounded-md px-3 focus:ring-2 focus:ring-purple-500"
                                                value={projectForm.endDate}
                                                onChange={e => setProjectForm(prev => ({ ...prev, endDate: e.target.value }))}
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full bg-purple-600 hover:bg-purple-700 py-6 text-base"
                                        onClick={handleInitiateProject}
                                        disabled={initiating}
                                    >
                                        <Users className="h-5 w-5 mr-2" />
                                        {initiating ? 'Converting...' : 'Initiate Project'}
                                    </Button>
                                </fieldset>
                            </CardContent>
                        </Card>
                    )}

                    {/* Step 3: Final Invoice Block */}
                    <Card className={`border-t-4 border-t-orange-600 shadow-md ${(sale.paymentStatus === 'paid' || (!sale.projectId || activeProjectObj?.status !== 'COMPLETED')) ? 'opacity-60 saturate-50' : ''}`}>
                        <CardHeader className="bg-slate-50 border-b pb-4">
                            <CardTitle className="text-lg flex items-center text-structura-black">
                                <span className="bg-orange-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs mr-3">3</span>
                                <FileText className="h-5 w-5 mr-2 text-orange-600" /> Step 3: Final Invoice
                            </CardTitle>
                            {sale.paymentStatus === 'paid' ? (
                                <p className="text-xs text-green-600 font-bold bg-green-50 p-2 rounded mt-2 border border-green-100">
                                    Workflow Completed: Sale is PAID.
                                </p>
                            ) : (!sale.projectId || activeProjectObj?.status !== 'COMPLETED') ? (
                                <p className="text-xs text-amber-600 font-bold bg-amber-50 p-2 rounded mt-2 border border-amber-100">
                                    Locked: Complete Project (Step 2) first.
                                </p>
                            ) : (
                                <p className="text-sm text-slate-500 font-normal mt-1">Project completed. Record final payment to close sale.</p>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="p-4 bg-orange-50 rounded-lg border border-orange-100 mb-2">
                                <p className="text-xs font-bold text-orange-900 uppercase">Remaining Balance</p>
                                <p className="text-2xl font-bold text-orange-700">{sale.currency} {sale.pendingAmount.toLocaleString()}</p>
                            </div>

                            <Button
                                className="w-full bg-orange-600 hover:bg-orange-700 py-6"
                                disabled={sale.paymentStatus === 'paid' || !sale.projectId || activeProjectObj?.status !== 'COMPLETED'}
                                onClick={async () => {
                                    if (confirm(`Do you confirm you want to GENERATE the Final Invoice for ${sale.currency} ${sale.pendingAmount}? This will mark the sale as PAID.`)) {
                                        const success = await handleUpdatePayment(sale.pendingAmount, "Final Invoice Payment");
                                        if (success) alert("Sale fully paid! You can now send the final invoice.");
                                    }
                                }}
                            >
                                <CheckCircle className="h-5 w-5 mr-2" /> Generate Final Invoice
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Payment History Card moves here */}
                    {sale.payments && sale.payments.length > 0 && (
                        <Card className="shadow-sm">
                            <CardHeader className="bg-slate-50 border-b">
                                <CardTitle className="text-base text-slate-700 flex items-center">
                                    <Clock className="h-4 w-4 mr-2" /> Payment History
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="max-h-64 overflow-y-auto">
                                    <table className="w-full text-xs">
                                        <thead className="bg-slate-50 border-b sticky top-0">
                                            <tr>
                                                <th className="px-3 py-2 font-medium text-slate-500 text-left">Date</th>
                                                <th className="px-3 py-2 font-medium text-slate-500 text-right">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sale.payments.map((payment: any, i: number) => (
                                                <tr key={i} className="border-b last:border-0 hover:bg-slate-50">
                                                    <td className="px-3 py-2 text-slate-500">
                                                        {formatDate(payment.date)}
                                                        <div className="text-[10px] text-slate-400 italic truncate max-w-[120px]">{payment.note}</div>
                                                    </td>
                                                    <td className="px-3 py-2 text-right font-bold text-green-600">+{sale.currency}{payment.amount.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
