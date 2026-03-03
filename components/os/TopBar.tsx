'use client';

import { Bell, Search, User } from 'lucide-react';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';

export default function TopBar() {
    const [userInfo, setUserInfo] = useState<{ name?: string, role?: string } | null>(null);

    useEffect(() => {
        const info = Cookies.get('user_info');
        if (info) {
            try {
                setUserInfo(JSON.parse(info));
            } catch (e) {
                console.error('Failed to parse user_info cookie', e);
            }
        }
    }, []);

    const displayName = userInfo?.name || 'Admin User';
    const displayRole = userInfo?.role
        ? userInfo.role.charAt(0).toUpperCase() + userInfo.role.slice(1)
        : 'Super Admin';

    return (
        <header className="flex h-16 items-center justify-between border-b border-structura-border bg-white px-6">
            {/* Left: Breadcrumbs / Context */}
            <div className="flex items-center gap-4">
                <h1 className="text-lg font-semibold text-structura-black">Overview</h1>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="h-10 w-64 rounded-lg border border-structura-border bg-structura-light pl-10 pr-4 text-sm focus:border-structura-blue focus:outline-none focus:ring-1 focus:ring-structura-blue transition-all"
                    />
                </div>

                <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-structura-black transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>

                <div className="h-8 w-px bg-slate-200 mx-1"></div>

                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-structura-black">{displayName}</span>
                        <span className="text-xs text-slate-500">{displayRole}</span>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-structura-light border border-structura-border flex items-center justify-center">
                        <User className="h-5 w-5 text-slate-600" />
                    </div>
                </div>
            </div>
        </header>
    );
}
