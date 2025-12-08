'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
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
                    <div className="w-8 h-8 bg-structura-black text-white flex items-center justify-center rounded-lg shadow-lg group-hover:rotate-90 transition-transform duration-500">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                            <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                    </div>
                    <span className="text-xl font-display font-bold tracking-tight">Structura<span className="text-structura-blue">IT</span></span>
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
