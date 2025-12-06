import { Link } from '@/src/i18n/navigation';
import { CheckCircle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function SuccessPage({ params }: { params: { locale: string } }) {
    const t = await getTranslations({ locale: params.locale, namespace: 'Common' });

    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
            <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl border border-structura-border text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-structura-black mb-2 font-display">
                    Message Sent!
                </h1>
                <p className="text-slate-600 mb-8">
                    Thank you for reaching out. Our team will get back to you shortly.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center justify-center w-full rounded-lg bg-structura-blue px-6 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-colors"
                >
                    Return to Homepage
                </Link>
            </div>
        </main>
    );
}
