import ServicePageTemplate from '@/components/servicePage/ServicePageTemplate';
import { servicesData } from '@/src/lib/servicesData';

export default function Page() {
    const service = servicesData.find(c => c.slug === 'data-analytics')?.services.find(s => s.slug === 'data-cleaning');
    if (!service) return null;
    return <ServicePageTemplate service={service} />;
}
