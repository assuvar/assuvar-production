export type InsightItem = {
    id: string;
    label: string;
    href: string;
    icon: string;
    description: string;
};

export const insightsData: InsightItem[] = [
    {
        id: "blogs",
        label: "Blogs",
        href: "/insights/blogs",
        icon: "BookOpen",
        description: "Insights & perspectives."
    },
    {
        id: "customer-success-stories",
        label: "Customer Success Stories",
        href: "/insights/customer-success-stories",
        icon: "Trophy",
        description: "Real client wins."
    },
    {
        id: "about-us",
        label: "About Us",
        href: "/about",
        icon: "Info",
        description: "Our mission & vision."
    },
    {
        id: "company-overview",
        label: "Company Overview",
        href: "/company-overview",
        icon: "Building2",
        description: "Facts & figures."
    },
    {
        id: "partner",
        label: "Partner With Us",
        href: "/insights/partner-with-us",
        icon: "Handshake",
        description: "Join our ecosystem."
    }
];
