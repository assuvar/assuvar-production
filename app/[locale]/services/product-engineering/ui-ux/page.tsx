import ServicePageTemplate from '@/components/servicePage/ServicePageTemplate';
import { servicesData } from '@/src/lib/servicesData';

export default function Page() {
    const service = servicesData.find(c => c.slug === 'product-engineering')?.services.find(s => s.slug === 'ui-ux');
    if (!service) return null;
    return <ServicePageTemplate service={service} />;
}
