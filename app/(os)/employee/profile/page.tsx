'use client';

import { PageHeader } from "@/components/os/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/os/ui/Card";
import { User, Mail, Shield, Smartphone, IdCard, Calendar } from "lucide-react";
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function EmployeeProfilePage() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const info = Cookies.get('user_info');
        if (info) {
            try {
                setUser(JSON.parse(info));
            } catch (e) { }
        }
    }, []);

    if (!user) return null;

    return (
        <div className="space-y-6">
            <PageHeader
                title="My Profile"
                description="View and manage your professional identity."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                    <CardHeader className="text-center pb-2">
                        <div className="mx-auto w-24 h-24 bg-structura-blue/10 rounded-full flex items-center justify-center mb-4">
                            <User className="w-12 h-12 text-structura-blue" />
                        </div>
                        <CardTitle className="text-xl font-bold">{user.name}</CardTitle>
                        <p className="text-sm text-slate-500">{user.designation || 'Staff Member'}</p>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4 border-t">
                        <div className="flex items-center gap-3 text-sm">
                            <Shield className="w-4 h-4 text-slate-400" />
                            <span className="font-medium">Role:</span>
                            <span className="text-slate-600 capitalize">{user.role}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <IdCard className="w-4 h-4 text-slate-400" />
                            <span className="font-medium">Username:</span>
                            <span className="text-slate-600 font-mono text-xs">{user.username}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-widest">Employee Details</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <ProfileItem icon={Mail} label="Official Email" value={user.email} />
                        <ProfileItem icon={Shield} label="Designation" value={user.designation || 'Staff Member'} />
                        <ProfileItem icon={Calendar} label="Status" value={user.status || 'Active'} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function ProfileItem({ icon: Icon, label, value }: any) {
    return (
        <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                <Icon className="w-3.5 h-3.5" />
                {label}
            </div>
            <p className="text-slate-900 font-semibold">{value || 'Not provided'}</p>
        </div>
    );
}
