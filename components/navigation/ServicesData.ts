export type FeaturedBlog = {
    id: string;
    title: string;
    thumbnail: string;
    link: string;
};

export type ServiceItem = {
    id: string;
    label: string;
    slug: string;
    description: string;
};

export type ServiceCategory = {
    id: string;
    label: string;
    slug: string;
    services: ServiceItem[];
    featuredBlog?: FeaturedBlog;
};

export const servicesData: ServiceCategory[] = [
    {
        id: "data-analytics",
        label: "Data & Analytics",
        slug: "data-analytics",
        services: [
            {
                id: "business-analytics",
                label: "Business Analytics",
                slug: "business-analytics",
                description: "Transform data into actionable insights."
            },
            {
                id: "text-analytics",
                label: "Text Analytics / NLP",
                slug: "text-analytics",
                description: "Unlock value from unstructured text."
            },
            {
                id: "computer-vision",
                label: "Computer Vision",
                slug: "computer-vision",
                description: "Analyze visual data with AI."
            },
            {
                id: "data-cleaning",
                label: "Data Cleaning",
                slug: "data-cleaning",
                description: "High-quality data preparation services."
            },
            {
                id: "annotation",
                label: "Data Annotation",
                slug: "annotation",
                description: "Precision labeling for ML models."
            },
            {
                id: "ai-automation",
                label: "AI Automation",
                slug: "ai-automation",
                description: "Automate complex analytical workflows."
            },
        ],
        featuredBlog: {
            id: "blog-analytics",
            title: "How Advanced Analytics is Reshaping Business Intelligence",
            thumbnail: "/images/blog/analytics-dashboard.jpg",
            link: "/blog/advanced-analytics-trends",
        },
    },
    {
        id: "product-engineering",
        label: "Product Engineering",
        slug: "product-engineering",
        services: [
            {
                id: "ui-ux",
                label: "UI/UX Design",
                slug: "ui-ux",
                description: "User-centric design experiences."
            },
            {
                id: "app-modernization",
                label: "App Modernization",
                slug: "app-modernization",
                description: "Revitalize legacy applications."
            },
            {
                id: "mobile-development",
                label: "Mobile App Development",
                slug: "mobile-development",
                description: "iOS and Android hybrid solutions."
            },
            {
                id: "app-support",
                label: "App Support",
                slug: "app-support",
                description: "24/7 reliability for your apps."
            },
            {
                id: "cloud-setup",
                label: "Cloud Hosting",
                slug: "cloud-setup",
                description: "Seamless cloud infrastructure deployment."
            },
            {
                id: "api-integration",
                label: "API Integrations",
                slug: "api-integration",
                description: "Connect your systems efficiently."
            },
        ],
        featuredBlog: {
            id: "blog-engineering",
            title: "The Future of Product Engineering: AI-Driven Design",
            thumbnail: "/images/blog/minimal-ui.jpg",
            link: "/blog/future-product-engineering",
        },
    },
    {
        id: "intelligent-automation",
        label: "Intelligent Automation",
        slug: "intelligent-automation",
        services: [
            {
                id: "low-code",
                label: "Low-code Automation",
                slug: "low-code",
                description: "Rapid automation with less code."
            },
            {
                id: "smart-workflow",
                label: "Workflow Automation",
                slug: "smart-workflow",
                description: "Optimize business processes intelligently."
            },
            {
                id: "rpa",
                label: "RPA Solutions",
                slug: "rpa",
                description: "Robotic process automation solutions."
            },
            {
                id: "ai-assistant-integration",
                label: "AI Assistants",
                slug: "ai-assistant-integration",
                description: "Integrate LLMs into your daily workflow."
            },
            {
                id: "process-mining",
                label: "Process Mining",
                slug: "process-mining",
                description: "Discover and fix process bottlenecks."
            },
            {
                id: "decision-automation",
                label: "Decision Automation",
                slug: "decision-automation",
                description: "Data-driven automated decision making."
            },
        ],
        featuredBlog: {
            id: "blog-automation",
            title: "Automating the Mundane: A Guide to Intelligent Workflows",
            thumbnail: "/images/blog/automation-bot.jpg",
            link: "/blog/intelligent-workflow-guide",
        },
    },
    {
        id: "quality-engineering",
        label: "Quality Engineering",
        slug: "quality-engineering",
        services: [
            {
                id: "manual-testing",
                label: "Manual Testing",
                slug: "manual-testing",
                description: "Detailed human-verified quality assurance."
            },
            {
                id: "mobile-app-testing",
                label: "Mobile Testing",
                slug: "mobile-app-testing",
                description: "Comprehensive coverage across devices."
            },
            {
                id: "test-automation",
                label: "Test Automation",
                slug: "test-automation",
                description: "Speed up testing cycles with AI."
            },
            {
                id: "llm-testing",
                label: "LLM Testing",
                slug: "llm-testing",
                description: "Validate accuracy of Large Language Models."
            },
            {
                id: "uat",
                label: "UAT",
                slug: "uat",
                description: "User Acceptance Testing for final sign-off."
            },
            {
                id: "localization",
                label: "Localization",
                slug: "localization",
                description: "Ensure global readiness of your product."
            },
            {
                id: "accessibility",
                label: "Accessibility",
                slug: "accessibility",
                description: "WCAG compliance and inclusive design."
            },
            {
                id: "performance-testing",
                label: "Performance Testing",
                slug: "performance-testing",
                description: "Load testing for optimal performance."
            },
        ],
        featuredBlog: {
            id: "blog-quality",
            title: "Ensuring Quality in the Age of AI: New Testing Paradigms",
            thumbnail: "/images/blog/testing-lab.jpg",
            link: "/blog/ai-testing-paradigms",
        },
    },
];
