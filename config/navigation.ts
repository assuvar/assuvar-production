export interface NavigationItem {
    name: string;
    href: string;
    icon: string; // Changed from component to string identifier
}

export const adminNavigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
    { name: 'Leads', href: '/admin/leads', icon: 'Users' },
    { name: 'Clients', href: '/admin/clients', icon: 'Briefcase' }, // NEW
    { name: 'Quotations', href: '/admin/quotes', icon: 'FileText' },
    { name: 'Sales', href: '/admin/sales', icon: 'DollarSign' }, // Renamed from Sales & Quotes to avoid confusion, changed icon to DollarSign
    { name: 'Projects', href: '/admin/projects', icon: 'Briefcase' },
    { name: 'Payroll', href: '/admin/payroll', icon: 'DollarSign' },
    { name: 'Marketing', href: '/admin/marketing', icon: 'Megaphone' },
    { name: 'Documents', href: '/admin/documents', icon: 'BookOpen' },
    { name: 'Access Control', href: '/admin/users/invite', icon: 'ShieldCheck' },
];

export const partnerNavigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/partner', icon: 'LayoutDashboard' },
    { name: 'Leads', href: '/partner/leads', icon: 'Users' },
    { name: 'Sales', href: '/partner/sales', icon: 'FileText' },
    { name: 'Commissions', href: '/partner/commissions', icon: 'DollarSign' },
];

export const clientNavigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/client', icon: 'LayoutDashboard' },
    { name: 'Projects', href: '/client/projects', icon: 'Briefcase' },
    { name: 'Payments', href: '/client/payments', icon: 'CreditCard' },
    { name: 'Documents', href: '/client/documents', icon: 'BookOpen' },
];
