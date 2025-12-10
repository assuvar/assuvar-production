export type SuccessStory = {
    id: string;
    client: string;
    industry: string;
    title: string;
    problem: string;
    solution: string;
    result: string;
    technologies: string[];
    slug: string;
    gifUrl?: string;
};

export const successStoriesData: SuccessStory[] = [
    {
        id: "1",
        client: "Global Retail Inc.",
        industry: "Retail & Ecommerce",
        title: "Scaling Black Friday Traffic with Serverless",
        problem: "Legacy infrastructure crashed under peak loads, managing only 10k concurrent users.",
        solution: "Migrated to AWS Lambda and DynamoDB with auto-scaling capabilities.",
        result: "Handled 500k+ concurrent users with 99.999% uptime and 40% cost reduction.",
        technologies: ["AWS", "Lambda", "DynamoDB", "Next.js"],
        slug: "global-retail-serverless",
        gifUrl: "/assets/projects/retail-demo.gif"
    },
    {
        id: "2",
        client: "MediCare Plus",
        industry: "Healthcare",
        title: "HIPAA-Compliant Telehealth Platform",
        problem: "Need for a secure, user-friendly video consultation app amidst regulatory complexity.",
        solution: "Built an encrypted WebRTC platform with strict access controls and audit logs.",
        result: "Reduced patient wait times by 60% and achieved full HIPAA certification.",
        technologies: ["WebRTC", "Node.js", "PostgreSQL", "Docker"],
        slug: "medicare-telehealth-platform",
        gifUrl: "/assets/projects/health-demo.gif"
    },
    {
        id: "3",
        client: "FinTech Sol",
        industry: "Finance",
        title: "Real-Time Fraud Detection System",
        problem: "High rate of false positives in transaction monitoring leading to customer dissatisfaction.",
        solution: "Implemented an AI-driven anomaly detection model processing streams in real-time.",
        result: "Detected 95% of fraud attempts while reducing false positives by 70%.",
        technologies: ["Python", "TensorFlow", "Kafka", "Kubernetes"],
        slug: "fintech-fraud-detection",
        gifUrl: "/assets/projects/fintech-demo.gif"
    },
    {
        id: "4",
        client: "EduLearn Co.",
        industry: "Education",
        title: "Interactive LMS for Remote Learning",
        problem: "Existing LMS was static and failed to engage students in a remote setting.",
        solution: "Developed a gamified learning platform with real-time collaboration features.",
        result: "Student engagement increased by 85% and course completion rates doubled.",
        technologies: ["React", "Firebase", "Socket.io", "Tailwind CSS"],
        slug: "edulearn-interactive-lms",
        gifUrl: "/assets/projects/edu-demo.gif"
    },
    {
        id: "5",
        client: "Logistics Pro",
        industry: "Supply Chain",
        title: "AI-Powered Route Optimization",
        problem: "Inefficient fleet routing caused high fuel costs and delivery delays.",
        solution: "Deployed a custom routing engine using graph algorithms and traffic data.",
        result: "Cut fuel consumption by 25% and improved on-time deliveries by 40%.",
        technologies: ["Python", "Neo4j", "Google Maps API", "Redis"],
        slug: "logistics-route-optimization",
        gifUrl: "/assets/projects/logistics-demo.gif"
    },
    {
        id: "6",
        client: "EstateView",
        industry: "Real Estate",
        title: "VR Property Tours Platform",
        problem: "Static images failed to convert international buyers for luxury properties.",
        solution: "Created a WebGL-based VR tour experience accessible directly in the browser.",
        result: "Doubled international sales inquiries and reduced sales cycle by 3 weeks.",
        technologies: ["Three.js", "WebGL", "React", "AWS S3"],
        slug: "estateview-vr-tours",
        gifUrl: "/assets/projects/estate-demo.gif"
    },
    {
        id: "7",
        client: "AutoMotive X",
        industry: "Manufacturing",
        title: "IoT Predictive Maintenance",
        problem: "Unplanned machinery downtime cost millions in lost production.",
        solution: "Connected factory floor sensors to a central dashboard for predictive analysis.",
        result: "Reduced downtime by 35% through proactive maintenance alerts.",
        technologies: ["IoT", "Azure IoT Hub", "PowerBI", "C++"],
        slug: "automotive-predictive-maintenance",
        gifUrl: "/assets/projects/auto-demo.gif"
    },
    {
        id: "8",
        client: "FashionHub",
        industry: "Retail & Ecommerce",
        title: "Influencer Storefront Website",
        problem: "Checkout friction was high for traffic coming from social media influencers.",
        solution: "Built a headless commerce PWA optimized for mobile social traffic.",
        result: "Reduced checkout friction by 40% and tripled conversion rates.",
        technologies: ["Shopify Plus", "Hydrogen", "Sanity CMS", "Vercel"],
        slug: "fashionhub-influencer-store",
        gifUrl: "/assets/projects/fashion-demo.gif"
    }
];
