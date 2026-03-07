'use client';

import { PageHeader } from "@/components/os/ui/PageHeader";
import { Card, CardContent } from "@/components/os/ui/Card";
import EmployeeInviteForm from "@/components/os/users/EmployeeInviteForm";
import { Users } from "lucide-react";

export default function EmployeeInvitePage() {
    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <PageHeader
                title="Invite Employee & Staff"
                description="Send a secure invitation to a new staff member to join the platform."
            />

            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                        <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
                            <Users className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">Employee Details</h3>
                            <p className="text-sm text-slate-500">Enter the information to generate a verification link.</p>
                        </div>
                    </div>

                    <EmployeeInviteForm />
                </CardContent>
            </Card>
        </div>
    );
}
