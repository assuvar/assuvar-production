'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from '@/src/i18n/navigation';

interface ProductTeaserProps {
    title: string;
    description: string;
}

export default function ProductTeaser({ title, description }: ProductTeaserProps) {
    return (
        <main className="min-h-screen bg-white pt-20 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 z-0 bg-white">
                <div className="absolute top-0 left-0 right-0 h-[50vh] bg-accent-gradient opacity-5 skew-y-3 origin-top-left transform -translate-y-20"></div>
            </div>

            <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider mb-8"
                >
                    <span className="w-2 h-2 rounded-full bg-structura-blue animate-pulse"></span>
                    Coming Soon
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-display font-bold text-structura-black mb-6"
                >
                    {title}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-12"
                >
                    {description}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Link
                        href={`/contact?type=product-interest&product=${encodeURIComponent(title)}`}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-accent-gradient text-white rounded-lg font-bold hover:shadow-lg hover:shadow-structura-blue/20 transition-all duration-300 group"
                    >
                        Notify Me <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>

                <div className="mt-12">
                    <Link href="/" className="text-slate-400 hover:text-structura-black text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
