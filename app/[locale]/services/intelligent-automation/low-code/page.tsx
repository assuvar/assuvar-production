import ServicePageTemplate from '@/components/servicePage/ServicePageTemplate';
import { servicesData } from '@/src/lib/servicesData';

export default function Page() {
    const service = servicesData.find(c => c.slug === 'intelligent-automation')?.services.find(s => s.slug === 'low-code');
    if (!service) return null;
    return <ServicePageTemplate service={service} />;
}
