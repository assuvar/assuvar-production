export interface NavigationItem {
    name: string;
    href: string;
    icon: string;
    children?: NavigationItem[];
}

export const adminNavigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
    { name: 'Leads', href: '/admin/leads', icon: 'Users' },
    { name: 'Clients', href: '/admin/clients', icon: 'Briefcase' }, // NEW
    { name: 'Quotations', href: '/admin/quotes', icon: 'FileText' },
    { name: 'Sales', href: '/admin/sales', icon: 'DollarSign' }, // Renamed from Sales & Quotes to avoid confusion, changed icon to DollarSign
    { name: 'Projects', href: '/admin/projects', icon: 'Briefcase' },
    { name: 'Employee & Staffs', href: '/admin/payroll', icon: 'Users' },
    { name: 'Marketing', href: '/admin/marketing', icon: 'Megaphone' },
    { name: 'Documents', href: '/admin/documents', icon: 'BookOpen' },
    {
        name: 'Access Control',
        href: '/admin/users',
        icon: 'ShieldCheck',
        children: [
            { name: 'Invitation', href: '/admin/users/invite', icon: 'ShieldCheck' },
            { name: 'Added Clients', href: '/admin/users/clients-list', icon: 'Users' },
            { name: 'Added Partners', href: '/admin/users/partners-list', icon: 'Handshake' },
        ]
    },
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

export const employeeNavigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/employee/dashboard', icon: 'LayoutDashboard' },
    { name: 'My Profile', href: '/employee/profile', icon: 'User' },
    { name: 'My Projects', href: '/employee/projects', icon: 'Briefcase' },
    { name: 'My Payslips', href: '/employee/payslips', icon: 'FileText' },
];

export const managerNavigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
    { name: 'Leads', href: '/admin/leads', icon: 'Users' },
    { name: 'Clients', href: '/admin/clients', icon: 'Briefcase' },
    { name: 'Quotations', href: '/admin/quotes', icon: 'FileText' },
    { name: 'Sales', href: '/admin/sales', icon: 'DollarSign' },
    { name: 'Projects', href: '/admin/projects', icon: 'Briefcase' },
    { name: 'Employee & Staffs', href: '/admin/payroll', icon: 'Users' },
    { name: 'Marketing', href: '/admin/marketing', icon: 'Megaphone' },
    { name: 'Documents', href: '/admin/documents', icon: 'BookOpen' },
];

/**
 * Utility to check if a user with a specific role and designation 
 * has access to a navigation item.
 */
export function checkPermission(user: { role: string, designation?: string }, item: string): boolean {
    if (user.role === 'admin') return true;

    if (user.role === 'employee' && user.designation === 'Manager') {
        const allowed = [
            'Dashboard', 'Leads', 'Clients', 'Quotations',
            'Sales', 'Projects', 'Employee & Staffs', 'Marketing', 'Documents'
        ];
        return allowed.includes(item);
    }

    // For normal employees
    if (user.role === 'employee') {
        const allowed = ['Dashboard', 'My Profile', 'My Projects', 'My Payslips'];
        return allowed.includes(item);
    }

    return true;
}
