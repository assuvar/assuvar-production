'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    DollarSign,
    FileText,
    CreditCard,
    ShieldCheck,
    Megaphone,
    BookOpen,
    Settings,
    LogOut,
    LucideIcon,
    Handshake,
    ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { NavigationItem, checkPermission, managerNavigation, salesNavigation } from '@/config/navigation';
import Cookies from 'js-cookie';

interface SidebarProps {
    items: NavigationItem[];
}

const iconMap: Record<string, LucideIcon> = {
    LayoutDashboard,
    Users,
    Briefcase,
    DollarSign,
    FileText,
    CreditCard,
    ShieldCheck,
    Megaphone,
    BookOpen,
    Settings,
    Handshake
};

export default function Sidebar({ items: initialItems }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
    const [items, setItems] = useState<NavigationItem[]>(initialItems);

    useEffect(() => {
        const info = Cookies.get('user_info');
        if (info) {
            try {
                const user = JSON.parse(info);

                // If Manager/Sales is in /admin, use relevant navigation
                if (user.role === 'employee' && pathname.startsWith('/admin')) {
                    if (user.designation === 'Manager') {
                        setItems(managerNavigation);
                    } else if (user.designation === 'Sales Staff') {
                        setItems(salesNavigation);
                    } else {
                        const filtered = initialItems.filter(item => checkPermission(user, item.name));
                        setItems(filtered);
                    }
                } else {
                    // Filter standard items based on internal permissions
                    const filtered = initialItems.filter(item => checkPermission(user, item.name));
                    setItems(filtered);
                }
            } catch (e) {
                console.error('Failed to parse user_info', e);
            }
        }
    }, [pathname, initialItems]);

    // Auto-expand menu if child is active
    useEffect(() => {
        items.forEach(item => {
            if (item.children?.some(child => pathname === child.href)) {
                setExpandedItems(prev => ({ ...prev, [item.name]: true }));
            }
        });
    }, [pathname, items]);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            // Redirect to login (assuming /login exists, otherwise fallback to root)
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    return (
        <div className="flex h-full w-64 flex-col border-r border-structura-border bg-white">
            {/* Branding */}
            <div className="flex h-16 items-center gap-2 px-6 border-b border-structura-border">
                <div className="w-8 h-8 flex items-center justify-center">
                    <Image
                        src="/assets/logo.svg"
                        alt="Assuvar Logo"
                        width={32}
                        height={32}
                        className="w-full h-full object-contain"
                    />
                </div>
                <span className="sr-only">Assuvar</span>
                <Image
                    src="/assets/assuvar-wordmark.svg"
                    alt="Assuvar"
                    width={173}
                    height={30}
                    className="h-5 w-auto"
                />
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {items.map((item) => {
                    const hasChildren = item.children && item.children.length > 0;
                    const isActive = pathname === item.href || (item.children?.some(child => pathname === child.href));
                    const isChildActive = item.children?.some(child => pathname === child.href);
                    const Icon = iconMap[item.icon] || LayoutDashboard;

                    return (
                        <div key={item.name} className="space-y-1">
                            {hasChildren ? (
                                <>
                                    <button
                                        onClick={() => {
                                            const newState = !expandedItems[item.name];
                                            setExpandedItems(prev => ({ ...prev, [item.name]: newState }));
                                        }}
                                        className={cn(
                                            'group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                                            isActive || isChildActive
                                                ? 'bg-structura-blue/5 text-structura-blue'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-structura-black'
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className={cn("h-5 w-5", (isActive || isChildActive) ? "text-structura-blue" : "text-slate-500 group-hover:text-structura-black")} />
                                            {item.name}
                                        </div>
                                        <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", expandedItems[item.name] ? "rotate-180" : "")} />
                                    </button>
                                    {expandedItems[item.name] && (
                                        <div className="mt-1 ml-4 space-y-1 border-l border-slate-100 pl-4">
                                            {item.children?.map((child) => {
                                                const isSubActive = pathname === child.href;
                                                const SubIcon = iconMap[child.icon] || Icon;
                                                return (
                                                    <Link
                                                        key={child.name}
                                                        href={child.href}
                                                        className={cn(
                                                            'flex items-center gap-3 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200',
                                                            isSubActive
                                                                ? 'text-structura-blue bg-structura-blue/5'
                                                                : 'text-slate-500 hover:text-structura-black hover:bg-slate-50'
                                                        )}
                                                    >
                                                        <SubIcon className="h-3.5 w-3.5" />
                                                        {child.name}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={cn(
                                        'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                                        isActive
                                            ? 'bg-structura-blue/10 text-structura-blue'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-structura-black'
                                    )}
                                >
                                    <Icon className={cn("h-5 w-5", isActive ? "text-structura-blue" : "text-slate-500 group-hover:text-structura-black")} />
                                    {item.name}
                                </Link>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* User / Logout */}
            <div className="border-t border-structura-border p-4">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-red-600 transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
