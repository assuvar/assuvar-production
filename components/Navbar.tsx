'use client';

import { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, Link } from '../src/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
    const t = useTranslations('Navbar');
    const locale = useLocale();
    const pathname = usePathname();
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

    const languages = [
        { code: 'en', label: 'English', detail: 'United States' },
        { code: 'de', label: 'Deutsch', detail: 'Germany' },
        { code: 'es', label: 'Español', detail: 'Spain' },
        { code: 'fr', label: 'Français', detail: 'France' },
        { code: 'ar', label: 'العربية', detail: 'Middle East' },
        { code: 'zh', label: '中文', detail: 'China' },
    ];

    const currentLang = languages.find(l => l.code === locale) || languages[0];

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

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                    <div className="relative group h-20 flex items-center cursor-pointer">
                        <span className="group-hover:text-structura-black transition-colors flex items-center gap-1">
                            {t('services')} <ChevronDown className="w-3 h-3" />
                        </span>
                        <div className="mega-menu absolute top-20 left-1/2 -translate-x-1/2 w-[600px] bg-white border border-structura-border shadow-xl rounded-xl p-6 opacity-0 visibility-hidden transition-all duration-200 transform translate-y-2 pointer-events-none group-hover:pointer-events-auto">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h5 className="font-display font-bold text-structura-black mb-3">{t('infrastructure')}</h5>
                                    <ul className="space-y-2">
                                        <li><Link href="#" className="block hover:text-structura-blue hover:translate-x-1 transition-all">{t('cloudArchitecture')}</Link></li>
                                        <li><Link href="#" className="block hover:text-structura-blue hover:translate-x-1 transition-all">{t('hybridSystems')}</Link></li>
                                        <li><Link href="#" className="block hover:text-structura-blue hover:translate-x-1 transition-all">{t('dataCenters')}</Link></li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="font-display font-bold text-structura-black mb-3">{t('security')}</h5>
                                    <ul className="space-y-2">
                                        <li><Link href="#" className="block hover:text-structura-blue hover:translate-x-1 transition-all">{t('cyberDefense')}</Link></li>
                                        <li><Link href="#" className="block hover:text-structura-blue hover:translate-x-1 transition-all">{t('complianceAudit')}</Link></li>
                                        <li><Link href="#" className="block hover:text-structura-blue hover:translate-x-1 transition-all">{t('zeroTrust')}</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Link href="#" className="hover:text-structura-black transition-colors">{t('solutions')}</Link>
                    <Link href="#" className="hover:text-structura-black transition-colors">{t('enterprise')}</Link>
                    <Link href="#" className="hover:text-structura-black transition-colors">{t('insights')}</Link>
                </div>

                <div className="hidden md:flex items-center gap-6">
                    <LanguageSwitcher />

                    <div className="h-4 w-px bg-slate-300"></div>
                    <Link href="#" className="btn-fusion px-5 py-2.5 rounded-lg text-sm font-semibold">
                        {t('getConsultation')}
                    </Link>
                </div>
            </div>
        </nav>
    );
}
