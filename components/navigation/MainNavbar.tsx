'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { usePathname, Link } from '@/src/i18n/navigation';
import { Globe } from 'lucide-react';
import LanguageSwitcher from '../LanguageSwitcher';

// Lazy load heavy navigation components
const DesktopMegaMenu = dynamic(() => import('./DesktopMegaMenu'), { ssr: true });
const MobileFullScreenMenu = dynamic(() => import('./MobileFullScreenMenu'), { ssr: true });

export default function MainNavbar() {
    const t = useTranslations('Navbar');
    const pathname = usePathname();

    // Reconstruct the logo logic
    return (
        <nav className="fixed w-full top-0 z-50 nav-glass" dir="ltr">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group z-50">
                    <div className="w-10 h-10 flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                        <Image
                            src="/assets/logo.svg"
                            alt="Structura IT Logo"
                            width={40}
                            height={40}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <span className="sr-only">Assuvar</span>
                    <Image
                        src="/assets/assuvar-wordmark.svg"
                        alt="Assuvar"
                        width={173}
                        height={30}
                        className="h-6 w-auto"
                    />
                </Link>

                {/* DESKTOP NAV items (> 768px) */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <DesktopMegaMenu />
                    <Link href="#" className="hover:text-structura-black transition-colors">Solutions</Link>
                    <Link href="#" className="hover:text-structura-black transition-colors">Enterprise</Link>
                    <Link href="#" className="hover:text-structura-black transition-colors">Insights</Link>
                </div>

                {/* Desktop Right Side Actions */}
                <div className="hidden md:flex items-center gap-6">
                    <LanguageSwitcher />
                    <div className="h-4 w-px bg-slate-300"></div>
                    <Link href="#" className="btn-fusion px-5 py-2.5 rounded-lg text-sm font-semibold">
                        {t('getConsultation')}
                    </Link>
                </div>

                {/* MOBILE NAV Trigger (< 768px) */}
                <MobileFullScreenMenu />
            </div>
        </nav>
    );
}
