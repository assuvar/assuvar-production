import IndustryPageLayout from '@/components/industries/IndustryPageLayout';
import { industriesData } from '@/components/navigation/IndustriesData';

export default function ManufacturingPage() {
    const industry = industriesData.find(i => i.id === 'manufacturing')!;

    return (
        <IndustryPageLayout
            industry={industry}
            problems={[
                { text: "Supply chain visibility" },
                { text: "Predictive maintenance" },
                { text: "Production line efficiency" },
                { text: "Legacy system integration" }
            ]}
            solutions={[
                { title: "IoT Integration", description: "Connect sensors for real-time machine monitoring.", icon: "Cpu" },
                { title: "Workflow Automation", description: "Automate inventory and logistics scheduling.", icon: "Truck" },
                { title: "Process Mining", description: "Identify bottlenecks in production workflows.", icon: "Activity" },
                { title: "Data Governance", description: "Secure and structured industrial data.", icon: "Database" },
                { title: "QA Automation", description: "Rigorous testing for mission-critical software.", icon: "Shield" }
            ]}
            values={[
                { title: "Efficiency", icon: "Zap" },
                { title: "Predictability", icon: "Activity" },
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
