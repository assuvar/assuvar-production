'use client';

import { Bell, User, LogOut, FileText, Check } from 'lucide-react';
import Cookies from 'js-cookie';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Notification {
    _id: string;
    title: string;
    message: string;
    type: string;
    createdAt: string;
}

export default function TopBar() {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState<{ name?: string, role?: string, designation?: string } | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const notifRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const info = Cookies.get('user_info');
        if (info) {
            try {
                setUserInfo(JSON.parse(info));
                fetchNotifications();
            } catch (e) {
                console.error('Failed to parse user_info cookie', e);
            }
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotifOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/notifications/unread');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await fetch(`/api/notifications/${id}/read`, { method: 'PUT' });
            setNotifications(prev => prev.filter(n => n._id !== id));
            router.push('/admin/leads'); // Redirect to leads since we only have new_lead right now
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    const displayName = userInfo?.name || 'Admin User';

    // Determine exact display role (Admin, Manager, Employee)
    let displayRole = 'Super Admin';
    let headerRole = 'Admin';
    if (userInfo?.role) {
        if (userInfo.role === 'admin') {
            displayRole = 'Admin';
            headerRole = 'Admin';
        } else if (userInfo.role === 'employee' && userInfo.designation === 'Manager') {
            displayRole = 'Manager';
            headerRole = 'Manager';
        } else {
            displayRole = 'Employee';
            headerRole = 'Employee';
        }
    }

    return (
        <header className="flex h-16 items-center justify-between border-b border-structura-border bg-white px-6">
            {/* Left: Breadcrumbs / Header Role */}
            <div className="flex items-center gap-4">
                <h1 className="text-lg font-semibold text-structura-black px-3 py-1 bg-structura-blue/10 text-structura-blue rounded-full border border-structura-blue/20">
                    {headerRole}
                </h1>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-structura-black transition-colors"
                    >
                        <Bell className="h-5 w-5" />
                        {notifications.length > 0 && (
                            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {isNotifOpen && (
                        <div className="absolute right-0 mt-2 w-80 rounded-xl border border-structura-border bg-white shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="px-4 py-3 border-b border-structura-border flex items-center justify-between bg-slate-50">
                                <h3 className="font-semibold text-structura-black">Notifications</h3>
                                <span className="text-xs bg-structura-blue text-white px-2 py-0.5 rounded-full">{notifications.length} New</span>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-4 text-center text-slate-500 text-sm py-8">
                                        <Bell className="h-8 w-8 mx-auto mb-2 text-slate-300 opacity-50" />
                                        No new notifications
                                    </div>
                                ) : (
                                    notifications.map(notif => (
                                        <div key={notif._id} onClick={() => markAsRead(notif._id)} className="p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3">
                                            <div className="mt-1">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                    <FileText className="h-4 w-4" />
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-structura-black">{notif.title}</h4>
                                                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
                                                <span className="text-[10px] text-slate-400 mt-2 block">
                                                    {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-8 w-px bg-slate-200 mx-1"></div>

                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-full pr-4 transition-colors text-left"
                    >
                        <div className="flex flex-col items-end hidden sm:flex">
                            <span className="text-sm font-medium text-structura-black">{displayName}</span>
                            <span className="text-xs text-slate-500">{displayRole}</span>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-structura-light border border-structura-border flex items-center justify-center">
                            <User className="h-4 w-4 text-slate-600" />
                        </div>
                    </button>

                    {/* Profile Dropdown */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-structura-border bg-white shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="px-4 py-3 border-b border-structura-border bg-slate-50">
                                <p className="text-sm font-semibold text-structura-black truncate">{displayName}</p>
                                <p className="text-xs text-slate-500 truncate">{displayRole}</p>
                            </div>
                            <div className="p-2">
                                {/* Profile Link (Placeholder for when profile exists, or can just be informational) */}
                                <div className="px-2 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-md cursor-default flex items-center gap-2">
                                    <User className="h-4 w-4" /> My Account
                                </div>
                                <div className="h-px bg-slate-100 my-1"></div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-2 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center gap-2 transition-colors font-medium"
                                >
                                    <LogOut className="h-4 w-4" /> Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
