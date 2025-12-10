export type BlogPost = {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    author: string;
    date: string;
    readTime: string;
    slug: string;
    image: string; // Placeholder string
};

export const blogsData: BlogPost[] = [
    {
        id: "1",
        title: "The Future of AI in Enterprise Architecture",
        excerpt: "How generative AI is reshaping the fundamental building blocks of modern software systems.",
        category: "AI & Innovation",
        author: "Sarah Chen",
        date: "Dec 10, 2025",
        readTime: "5 min read",
        slug: "future-of-ai-enterprise",
        image: "/assets/blog-ai.webp"
    },
    {
        id: "2",
        title: "Optimizing Cloud Costs at Scale",
        excerpt: "Strategies for reducing AWS and Azure bills without compromising on performance or reliability.",
        category: "Cloud Engineering",
        author: "Michael Ross",
        date: "Dec 05, 2025",
        readTime: "7 min read",
        slug: "optimizing-cloud-costs",
        image: "/assets/blog-cloud.webp"
    },
    {
        id: "3",
        title: "Accessibility as a Core Engineering Principle",
        excerpt: "Why WCAG compliance should be baked into your CI/CD pipeline, not an afterthought.",
        category: "Engineering Best Practices",
        author: "Amit Patel",
        date: "Nov 28, 2025",
        readTime: "4 min read",
        slug: "accessibility-core-principle",
        image: "/assets/blog-a11y.webp"
    },
    {
        id: "4",
        title: "Migrating from Monolith to Microservices: A Survivor's Guide",
        excerpt: "Lessons learned from decomposing a 10-year-old legacy application.",
        category: "Architecture",
        author: "Jessica Wu",
        date: "Nov 15, 2025",
        readTime: "8 min read",
        slug: "monolith-microservices-guide",
        image: "/assets/blog-microservices.webp"
    },
    {
        id: "5",
        title: "The Zero Trust Security Model Explained",
        excerpt: "Implementing strict identity verification for every person and device accessing resources.",
        category: "Security",
        author: "David Kim",
        date: "Nov 10, 2025",
        readTime: "6 min read",
        slug: "zero-trust-explained",
        image: "/assets/blog-security.webp"
    },
    {
        id: "6",
        title: "QA Automation: Beyond Selenium",
        excerpt: "Exploring modern testing frameworks like Playwright and Cypress for faster feedback loops.",
        category: "Quality Assurance",
        author: "Emily Davis",
        date: "Oct 22, 2025",
        readTime: "5 min read",
        slug: "qa-beyond-selenium",
        image: "/assets/blog-qa.webp"
    }
];
