'use client';

import { ChevronDown, ArrowRight } from 'lucide-react';
import { servicesData } from '@/src/lib/servicesData';
import { Link } from '@/src/i18n/navigation';
import { useState } from 'react';

export default function ServicesMegaMenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="relative group h-20 flex items-center"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button
                className="group-hover:text-structura-black text-slate-600 transition-colors flex items-center gap-1 font-medium text-sm focus:outline-none"
                aria-expanded={isOpen}
            >
                Services <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Mega Menu Dropdown */}
            <div
                className={`absolute top-20 left-1/2 -translate-x-1/2 w-[90vw] max-w-6xl bg-white border border-slate-100 shadow-2xl rounded-2xl p-8 transition-all duration-300 transform origin-top 
        ${isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 invisible pointer-events-none'}`}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {servicesData.map((category) => (
                        <div key={category.slug} className="flex flex-col">
                            <div className="mb-4 pb-2 border-b border-purple-100">
                                <Link
                                    href={`/services/${category.slug}`}
                                    className="font-display font-bold text-[#6A0DAD] text-lg hover:text-purple-700 transition-colors flex items-center gap-2"
                                >
                                    {category.title}
                                    <ArrowRight className="w-4 h-4 opacity-0 group-hover/cat:opacity-100 transition-opacity" />
                                </Link>
                            </div>
                            <ul className="space-y-2">
                                {category.services.map((service) => (
                                    <li key={service.id}>
                                        <Link
                                            href={`/services/${category.slug}/${service.slug}`}
                                            className="block text-sm text-slate-600 hover:text-[#6A0DAD] hover:translate-x-1 transition-all duration-200 py-1"
                                        >
                                            {service.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 bg-slate-50 -mx-8 -mb-8 px-8 py-4 rounded-b-2xl flex justify-between items-center text-xs text-slate-500">
                    <p>© Structura IT Services</p>
                    <Link href="/contact" className="text-[#6A0DAD] font-semibold hover:underline">
                        Need a custom solution? Let's talk &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
}
