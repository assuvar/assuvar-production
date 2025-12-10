import IndustryPageLayout from '@/components/industries/IndustryPageLayout';
import { industriesData } from '@/components/navigation/IndustriesData';

export default function AgenciesPage() {
    const industry = industriesData.find(i => i.id === 'agencies')!;

    return (
        <IndustryPageLayout
            industry={industry}
            problems={[
                { text: "Project scalability" },
                { text: "Resource allocation" },
                { text: "Client reporting transparency" },
                { text: "Operational bottlenecks" }
            ]}
            solutions={[
                { title: "White-Label Development", description: "Expand your service capacity instantly.", icon: "Layers" },
                { title: "Process Automation", description: "Automate recurring agency tasks.", icon: "Repeat" },
                { title: "Custom Dashboards", description: "Client-facing portals for real-time updates.", icon: "Activity" },
                { title: "Staff Augmentation", description: "Plug-and-play experts for your teams.", icon: "Users" },
                { title: "Technical Consulting", description: "Expert guidance for complex pitches.", icon: "Briefcase" }
            ]}
            values={[
                { title: "Scalability", icon: "Users" },
                { title: "Cost Savings", icon: "TrendingUp" },
                { title: "Reliability", icon: "Shield" }
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
