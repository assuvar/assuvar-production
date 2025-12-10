'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Github, Twitter, Linkedin } from 'lucide-react';
import AmbientWave from "@/components/AmbientWave";
import { servicesData } from '@/components/navigation/ServicesData';

export default function Footer() {
    return (
        <footer className="bg-white text-structura-black pt-24 pb-12 relative overflow-hidden border-t border-slate-100">
            <AmbientWave className="opacity-[0.03] rotate-180 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10 mb-16 relative z-10">
                {/* Logo & Description */}
                <div className="col-span-1 md:col-span-12 lg:col-span-3">
                    <Link href="#" className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 flex items-center justify-center rounded-md bg-slate-50 border border-slate-100">
                            <Image
                                src="/assets/logo.svg"
                                alt="Assuvar Logo"
                                width={32}
                                height={32}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <span className="sr-only">Assuvar</span>
                        <Image
                            src="/assets/assuvar-wordmark.svg"
                            alt="Assuvar"
                            width={173}
                            height={30}
                            className="h-5 w-auto"
                        />
                    </Link>
                    <p className="text-slate-500 text-sm max-w-xs leading-relaxed mb-8">
                        Building the digital foundations for tomorrow&apos;s enterprises. <br /> Robust. Secure. Scalable.
                    </p>

                    {/* Company & Legal Mobile/Condensed View if needed, or keep separate */}
                    <div className="flex gap-4">
                        <Link href="#" className="text-slate-400 hover:text-structura-blue transition-colors bg-slate-50 hover:bg-slate-100 p-2 rounded-full border border-slate-100"><Twitter className="w-4 h-4" /></Link>
                        <Link href="#" className="text-slate-400 hover:text-structura-blue transition-colors bg-slate-50 hover:bg-slate-100 p-2 rounded-full border border-slate-100"><Linkedin className="w-4 h-4" /></Link>
                        <Link href="#" className="text-slate-400 hover:text-structura-blue transition-colors bg-slate-50 hover:bg-slate-100 p-2 rounded-full border border-slate-100"><Github className="w-4 h-4" /></Link>
                    </div>
                </div>

                {/* Dynamic Services Columns */}
                {servicesData.map((category) => (
                    <div key={category.id} className="col-span-1 md:col-span-3 lg:col-span-2">
                        <h4 className="font-bold text-structura-black mb-6 text-sm uppercase tracking-wider">{category.label}</h4>
                        <ul className="space-y-3 text-sm text-slate-500">
                            {category.services.map((service) => (
                                <li key={service.id}>
                                    <Link
                                        href={`/services/${category.slug}/${service.slug}`}
                                        className="hover:text-structura-blue transition-colors block leading-tight"
                                    >
                                        {service.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                {/* Company & Legal (Condensed) */}
                <div className="col-span-1 md:col-span-12 lg:col-span-1 space-y-8">
                    <div>
                        <h4 className="font-bold text-structura-black mb-6 text-sm uppercase tracking-wider">Company</h4>
                        <ul className="space-y-3 text-sm text-slate-500">
                            <li><Link href="#" className="hover:text-structura-blue transition-colors">About</Link></li>
                            <li><Link href="#" className="hover:text-structura-blue transition-colors">Work</Link></li>
                            <li><Link href="#" className="hover:text-structura-blue transition-colors">Careers</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-structura-black mb-6 text-sm uppercase tracking-wider">Legal</h4>
                        <ul className="space-y-3 text-sm text-slate-500">
                            <li><Link href="#" className="hover:text-structura-blue transition-colors">Privacy</Link></li>
                            <li><Link href="#" className="hover:text-structura-blue transition-colors">Terms</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400 relative z-10">
                <p>&copy; Assuvar. All Rights Reserved.</p>
            </div>
        </footer>
    );
}
