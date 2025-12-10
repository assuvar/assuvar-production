import IndustryPageLayout from '@/components/industries/IndustryPageLayout';
import { industriesData } from '@/components/navigation/IndustriesData';

export default function EducationPage() {
    const industry = industriesData.find(i => i.id === 'education')!;

    return (
        <IndustryPageLayout
            industry={industry}
            problems={[
                { text: "Student engagement & retention" },
                { text: "Remote learning infrastructure" },
                { text: "Administrative efficiency" },
                { text: "LMS scalability" }
            ]}
            solutions={[
                { title: "LMS Development", description: "Custom learning management systems.", icon: "BookOpen" },
                { title: "Virtual Classrooms", description: "Interactive, real-time learning environments.", icon: "Monitor" },
                { title: "Student Analytics", description: "Track progress and identify at-risk students.", icon: "Activity" },
                { title: "Cloud Infrastructure", description: "Scalable hosting for peak enrollment periods.", icon: "Database" },
                { title: "Mobile Learning", description: "Accessible education on any device.", icon: "Users" }
            ]}
            values={[
                { title: "Scalability", icon: "Users" },
                { title: "Quality", icon: "GraduationCap" },
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
