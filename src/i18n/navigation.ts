import { createNavigation } from 'next-intl/navigation';
import { defineRouting } from 'next-intl/routing';

export const locales = [
    'en-US', 'en-GB', 'en-AU', 'en-CA', 'en-IN',
    'de-DE', 'fr-FR', 'es-ES', 'it-IT', 'nl-NL', 'sv-SE',
    'pt-BR', 'es-MX', 'ar-SA', 'zh-CN', 'zh-TW', 'ja-JP', 'ko-KR', 'ru-RU'
];

export const localeNames: Record<string, string> = {
    'en-US': 'English (United States)',
    'en-GB': 'English (United Kingdom)',
    'en-AU': 'English (Australia)',
    'en-CA': 'English (Canada)',
    'en-IN': 'English (India)',
    'de-DE': 'Deutsch (Germany)',
    'fr-FR': 'Français (France)',
    'es-ES': 'Español (Spain)',
    'it-IT': 'Italiano (Italy)',
    'nl-NL': 'Nederlands (Netherlands)',
    'sv-SE': 'Svenska (Sweden)',
    'pt-BR': 'Português (Brazil)',
    'es-MX': 'Español (Mexico / LATAM)',
    'ar-SA': 'العربية (Saudi Arabia)',
    'zh-CN': '中文 (China – Simplified)',
    'zh-TW': '中文 (Taiwan – Traditional)',
    'ja-JP': '日本語 (Japan)',
    'ko-KR': '한국어 (South Korea)',
    'ru-RU': 'Русский (Russia)'
};

export const routing = defineRouting({
    locales: locales,
    defaultLocale: 'en-US',
    localePrefix: 'always'
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
