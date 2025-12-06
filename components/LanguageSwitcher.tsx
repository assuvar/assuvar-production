'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter, localeNames, locales } from '@/src/i18n/navigation';
import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLocaleChange = (newLocale: string) => {
        setIsOpen(false);
        router.replace(pathname, { locale: newLocale });
    };

    const currentName = localeNames[locale] || locale;

    // Group locales by region for better UI (Optional, but "Accenture-style" implies structure)
    // For now, simple list with scroll

    return (
        <div className="relative z-50" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors rounded-md hover:bg-gray-100"
                aria-label="Select Language"
            >
                <Globe className="w-4 h-4" />
                <span className="hidden md:inline">{currentName.split('—')[0].trim()}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl max-h-[80vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2 space-y-1">
                        {locales.map((l) => (
                            <button
                                key={l}
                                onClick={() => handleLocaleChange(l)}
                                className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center justify-between group transition-colors
                  ${locale === l ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}
                `}
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium">{localeNames[l].split('—')[0]}</span>
                                    <span className="text-xs text-gray-500 group-hover:text-gray-700">
                                        {localeNames[l].split('—')[1] || l}
                                    </span>
                                </div>
                                {locale === l && <Check className="w-4 h-4" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
