export type ProductItem = {
    id: string;
    label: string;
    slug: string; // e.g., 'pos', 'clothing', 'crm'
    icon: string;
    description: string;
    status: 'active' | 'coming-soon';
};

export const productsData: ProductItem[] = [
    {
        id: "products-pos",
        label: "Assuvar POS",
        slug: "pos",
        icon: "ScanBarcode",
        description: "Complete retail point of sale.",
        status: "active"
    },
    {
        id: "products-clothing",
        label: "Assuvar for Clothing",
        slug: "clothing",
        icon: "Shirt",
        description: "Fashion retail management.",
        status: "coming-soon"
    },
    {
        id: "products-crm",
        label: "Assuvar CRM",
        slug: "crm",
        icon: "Users",
        description: "Customer relationship suite.",
        status: "coming-soon"
    },
    {
        id: "products-inventory",
        label: "Assuvar Inventory OS",
        slug: "inventory",
        icon: "Package",
        description: "Advanced stock control.",
        status: "coming-soon"
    },
    {
        id: "products-billing",
        label: "Assuvar Billing Suite",
        slug: "billing",
        icon: "CreditCard",
        description: "Invoicing & payments.",
        status: "coming-soon"
    }
];
