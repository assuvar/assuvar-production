import IndustryPageLayout from '@/components/industries/IndustryPageLayout';
import { industriesData } from '@/components/navigation/IndustriesData';

export default function HealthcarePage() {
    const industry = industriesData.find(i => i.id === 'healthcare')!;

    return (
        <IndustryPageLayout
            industry={industry}
            problems={[
                { text: "Patient data interoperability" },
                { text: "Compliance & security (HIPAA)" },
                { text: "Telehealth scalability" },
                { text: "Administrative burden" }
            ]}
            solutions={[
                { title: "EHR Integration", description: "Seamless data exchange between systems.", icon: "Database" },
                { title: "Security & Compliance", description: "Robust architecture meeting HIPAA standards.", icon: "Lock" },
                { title: "Telehealth Platforms", description: "Secure, high-quality video consultation apps.", icon: "Video" },
                { title: "Patient Portals", description: "User-friendly access to health records.", icon: "Users" },
                { title: "AI Diagnostics Support", description: "Assisted analysis for faster decision making.", icon: "Activity" }
            ]}
            values={[
                { title: "Reliability", icon: "Shield" },
                { title: "Quality", icon: "Heart" },
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
