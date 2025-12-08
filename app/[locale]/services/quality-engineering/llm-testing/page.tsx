import ServicePageTemplate from '@/components/servicePage/ServicePageTemplate';
import { servicesData } from '@/src/lib/servicesData';

export default function Page() {
    const service = servicesData.find(c => c.slug === 'quality-engineering')?.services.find(s => s.slug === 'llm-testing');
    if (!service) return null;
    return <ServicePageTemplate service={service} />;
}
