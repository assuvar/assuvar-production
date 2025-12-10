import { ShoppingBag, Factory, Building, Stethoscope, GraduationCap, Briefcase } from 'lucide-react';

export type IndustryItem = {
    id: string;
    label: string;
    slug: string;
    icon: string; // Changed from 'any' to 'string'
    description: string;
};

export const industriesData: IndustryItem[] = [
    {
        id: "retail-ecommerce",
        label: "Retail & Ecommerce",
        slug: "retail-ecommerce",
        icon: "ShoppingBag",
        description: "Unified commerce solutions."
    },
    {
        id: "manufacturing",
        label: "Manufacturing",
        slug: "manufacturing",
        icon: "Factory",
        description: "Industry 4.0 automation."
    },
    {
        id: "real-estate",
        label: "Real Estate",
        slug: "real-estate",
        icon: "Building",
        description: "PropTech innovation."
    },
    {
        id: "healthcare",
        label: "Healthcare",
        slug: "healthcare",
        icon: "Stethoscope",
        description: "Digital health platforms."
    },
    {
        id: "education",
        label: "Education",
        slug: "education",
        icon: "GraduationCap",
        description: "EdTech & learning systems."
    },
    {
        id: "agencies",
        label: "Agencies & Service Businesses",
        slug: "agencies",
        icon: "Briefcase",
        description: "Scalable agency operations."
    }
];
