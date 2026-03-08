'use client';

import { PageHeader } from "@/components/os/ui/PageHeader";
import { Card, CardContent } from "@/components/os/ui/Card";
import { FileText, Download, Calendar } from "lucide-react";
import { Button } from "@/components/os/ui/Button";

export default function EmployeePayslipsPage() {
    // Placeholder - In a real app, this would fetch from an API
    const payslips = [
        { id: '1', month: 'February 2026', date: '2026-02-28', status: 'Paid' },
        { id: '2', month: 'January 2026', date: '2026-01-31', status: 'Paid' },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="My Payslips"
                description="View and download your monthly salary statements."
            />

            <div className="grid grid-cols-1 gap-4">
                {payslips.map((slip) => (
                    <Card key={slip.id} className="hover:border-structura-blue transition-colors">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 rounded-xl">
                                    <FileText className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{slip.month}</h3>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                        <Calendar className="w-3 h-3" />
                                        Issued on {slip.date}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                                    {slip.status}
                                </span>
                                <Button variant="outline" size="sm" className="flex items-center gap-2">
                                    <Download className="w-4 h-4" />
                                    Download PDF
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
