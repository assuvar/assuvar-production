import IndustryPageLayout from '@/components/industries/IndustryPageLayout';
import { industriesData } from '@/components/navigation/IndustriesData';

export default function RetailPage() {
    const industry = industriesData.find(i => i.id === 'retail-ecommerce')!;

    return (
        <IndustryPageLayout
            industry={industry}
            problems={[
                { text: "Inventory accuracy & synchronization" },
                { text: "Order automation & fulfillment speed" },
                { text: "Sales optimization & conversion" },
                { text: "Real-time analytics dashboards" }
            ]}
            solutions={[
                { title: "Workflow Automation", description: "Streamline order processing from cart to delivery.", icon: "GitBranch" },
                { title: "AI Analytics", description: "Predict trends and personalize shopper experiences.", icon: "Activity" },
                { title: "Cloud Dashboards", description: "Centralized view of inventory across all channels.", icon: "Database" },
                { title: "QA Automation", description: "Ensure flawless checkout experiences every time.", icon: "Shield" },
                { title: "Integration Engineering", description: "Connect ERP, CRM, and eCommerce platforms seamlessly.", icon: "Settings" }
            ]}
            values={[
                { title: "Efficiency", icon: "Zap" },
                { title: "Cost Savings", icon: "TrendingUp" },
                { title: "Scalability", icon: "Users" }
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
