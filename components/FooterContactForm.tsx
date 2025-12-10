'use client';

import { usePathname } from 'next/navigation';
import GlobalContactForm from './GlobalContactForm';

export default function FooterContactForm() {
    const pathname = usePathname();

    // Don't show on contact page or partner page to avoid redundancy/conflicts
    if (pathname?.includes('/contact') || pathname?.includes('/partner-with-us')) {
        return null;
    }

    return (
        <section className="py-20 bg-slate-50 border-t border-slate-200">
            <div className="max-w-4xl mx-auto px-6">
                <GlobalContactForm mode="client" compact={true} className="border-slate-200 shadow-lg" />
            </div>
        </section>
    );
}
