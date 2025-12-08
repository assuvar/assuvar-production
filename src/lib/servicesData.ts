export type Service = {
    id: string;
    title: string;
    category: string;
    shortIntro: string;
    slug: string;
    icon?: string; // Optional icon name
};

export type ServiceCategory = {
    title: string;
    slug: string;
    services: Service[];
};

export const servicesData: ServiceCategory[] = [
    {
        title: "Data & Analytics",
        slug: "data-analytics",
        services: [
            {
                id: "business-analytics",
                title: "Business Analytics & Visualization",
                category: "Data & Analytics",
                shortIntro: "Transform raw data into actionable insights with powerful dashboards and visual stories.",
                slug: "business-analytics",
            },
            {
                id: "text-analytics",
                title: "Text Analytics / NLP",
                category: "Data & Analytics",
                shortIntro: "Unlock the value of unstructured text using advanced Natural Language Processing.",
                slug: "text-analytics",
            },
            {
                id: "computer-vision",
                title: "Computer Vision (AI-assisted)",
                category: "Data & Analytics",
                shortIntro: "Leverage AI to interpret and analyze visual data from the real world.",
                slug: "computer-vision",
            },
            {
                id: "data-cleaning",
                title: "Data Cleaning & Preparation",
                category: "Data & Analytics",
                shortIntro: "Ensure your data is accurate, consistent, and ready for analysis.",
                slug: "data-cleaning",
            },
            {
                id: "annotation",
                title: "Data Annotation & Labelling",
                category: "Data & Analytics",
                shortIntro: "High-quality data labeling services to train your AI and ML models.",
                slug: "annotation",
            },
            {
                id: "ai-automation",
                title: "AI Automation for Analytics",
                category: "Data & Analytics",
                shortIntro: "Automate complex analytical workflows to speed up decision-making.",
                slug: "ai-automation",
            },
        ],
    },
    {
        title: "Product Engineering",
        slug: "product-engineering",
        services: [
            {
                id: "ui-ux",
                title: "UI / UX Design",
                category: "Product Engineering",
                shortIntro: "Crafting intuitive and engaging user experiences for digital products.",
                slug: "ui-ux",
            },
            {
                id: "app-modernization",
                title: "App Modernization",
                category: "Product Engineering",
                shortIntro: "Revitalize legacy applications with modern UI and efficient refactoring.",
                slug: "app-modernization",
            },
            {
                id: "mobile-development",
                title: "Basic Mobile App Development",
                category: "Product Engineering",
                shortIntro: "Build functional and user-friendly mobile apps using FlutterFlow or React Native.",
                slug: "mobile-development",
            },
            {
                id: "app-support",
                title: "Application Support & Maintenance",
                category: "Product Engineering",
                shortIntro: "Reliable support to keep your applications running smoothly and securely.",
                slug: "app-support",
            },
            {
                id: "cloud-setup",
                title: "Basic Cloud Hosting Setup",
                category: "Product Engineering",
                shortIntro: "Get started with cloud infrastructure on AWS, Vercel, or Netlify.",
                slug: "cloud-setup",
            },
            {
                id: "api-integration",
                title: "API Integrations",
                category: "Product Engineering",
                shortIntro: "Seamlessly connect your software systems for better data flow and functionality.",
                slug: "api-integration",
            },
        ],
    },
    {
        title: "Intelligent Automation",
        slug: "intelligent-automation",
        services: [
            {
                id: "low-code",
                title: "Low-code Automation",
                category: "Intelligent Automation",
                shortIntro: "Streamline operations with Make.com, Zapier, and Power Automate.",
                slug: "low-code",
            },
            {
                id: "smart-workflow",
                title: "Smart Workflow Automation",
                category: "Intelligent Automation",
                shortIntro: "Design and implement intelligent workflows to reduce manual effort.",
                slug: "smart-workflow",
            },
            {
                id: "rpa",
                title: "RPA (Robotic Process Automation)",
                category: "Intelligent Automation",
                shortIntro: "Automate repetitive tasks with UiPath StudioX and Python scripts.",
                slug: "rpa",
            },
            {
                id: "ai-assistant-integration",
                title: "AI Assistant Integration",
                category: "Intelligent Automation",
                shortIntro: "Integrate powerful AI assistants like ChatGPT and Gemini into your processes.",
                slug: "ai-assistant-integration",
            },
            {
                id: "process-mining",
                title: "Process Mining (AI-assisted)",
                category: "Intelligent Automation",
                shortIntro: "Discover bottlenecks and optimize processes using AI-driven insights.",
                slug: "process-mining",
            },
            {
                id: "decision-automation",
                title: "Decision Support Automation",
                category: "Intelligent Automation",
                shortIntro: "Enhance decision-making with automated AI dashboards and reporting.",
                slug: "decision-automation",
            },
        ],
    },
    {
        title: "Quality Engineering",
        slug: "quality-engineering",
        services: [
            {
                id: "manual-testing",
                title: "Manual Website Testing",
                category: "Quality Engineering",
                shortIntro: "Thorough manual testing to ensure your website is bug-free and user-friendly.",
                slug: "manual-testing",
            },
            {
                id: "mobile-app-testing",
                title: "Mobile App Testing",
                category: "Quality Engineering",
                shortIntro: "Comprehensive testing for mobile applications across devices and OS.",
                slug: "mobile-app-testing",
            },
            {
                id: "test-automation",
                title: "AI-Assisted Test Automation",
                category: "Quality Engineering",
                shortIntro: "Accelerate testing with Playwright, Selenium IDE, and AI tools.",
                slug: "test-automation",
            },
            {
                id: "llm-testing",
                title: "LLM Testing",
                category: "Quality Engineering",
                shortIntro: "Evaluate Large Language Models for accuracy, safety, and consistency.",
                slug: "llm-testing",
            },
            {
                id: "uat",
                title: "UAT Testing",
                category: "Quality Engineering",
                shortIntro: "User Acceptance Testing to ensure the product meets business requirements.",
                slug: "uat",
            },
            {
                id: "localization",
                title: "Localization Testing",
                category: "Quality Engineering",
                shortIntro: "Verify your product performs well for users in different regions and languages.",
                slug: "localization",
            },
            {
                id: "accessibility",
                title: "Accessibility Testing",
                category: "Quality Engineering",
                shortIntro: "Ensure your digital products are accessible to everyone.",
                slug: "accessibility",
            },
            {
                id: "performance-testing",
                title: "Light Performance Testing",
                category: "Quality Engineering",
                shortIntro: "Basic load and performance testing to ensure stability.",
                slug: "performance-testing",
            },
        ],
    },
];
