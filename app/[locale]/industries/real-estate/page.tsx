import IndustryPageLayout from '@/components/industries/IndustryPageLayout';
import { industriesData } from '@/components/navigation/IndustriesData';

export default function RealEstatePage() {
    const industry = industriesData.find(i => i.id === 'real-estate')!;

    return (
        <IndustryPageLayout
            industry={industry}
            problems={[
                { text: "Property management silos" },
                { text: "Tenant experience friction" },
                { text: "Document processing delay" },
                { text: "Market data analysis" }
            ]}
            solutions={[
                { title: "PropTech Platforms", description: "Custom portals for tenants and owners.", icon: "Key" },
                { title: "Automated Workflows", description: "Streamline lease processing and maintenance requests.", icon: "GitBranch" },
                { title: "Data Visualization", description: "Interactive maps and market trend dashboards.", icon: "Map" },
                { title: "CRM Integration", description: "Unified view of leads and client interactions.", icon: "Users" },
                { title: "Mobile Apps", description: "On-the-go access for agents and property managers.", icon: "Activity" }
            ]}
            values={[
                { title: "Scalability", icon: "Users" },
                { title: "Cost Savings", icon: "TrendingUp" },
                { title: "Efficiency", icon: "Zap" }
            ]}
            trust={[
                { title: "Commitment", description: "Absolute clarity on goals.", icon: "Shield" },
                { title: "Craftsmanship", description: "Precision engineering.", icon: "Settings" },
                { title: "Reliability", description: "Systems you can trust.", icon: "Database" },
                { title: "Continuity", description: "Long-term partnership.", icon: "Activity" }
            ]}
        />
    );
}
