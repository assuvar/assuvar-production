'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from '@/src/i18n/navigation';

export default function ThankYouPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white p-12 rounded-3xl shadow-xl text-center border border-slate-100"
            >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h1 className="text-3xl font-bold text-structura-black mb-4">Message Received.</h1>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    Thank you for reaching out. Our engineering team has received your inquiry and will be in touch within 24 hours.
                </p>
                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-structura-black text-white rounded-full font-bold hover:shadow-lg transition-all text-sm">
                    Return Home <ArrowRight className="w-4 h-4" />
                </Link>
            </motion.div>
        </main>
    );
}
