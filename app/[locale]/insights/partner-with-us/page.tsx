'use client';

import { motion } from 'framer-motion';
import { Handshake, Globe2 } from 'lucide-react';
import GlobalContactForm from '@/components/GlobalContactForm';

export default function PartnerWithUsPage() {
    return (
        <main className="pt-20 bg-white min-h-screen">
            {/* HERO */}
            <section className="relative py-24 bg-accent-gradient text-white overflow-hidden">
                <div className="absolute inset-0 z-0 bg-brand-gradient opacity-10"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-bold text-white mb-6"
                    >
                        <Handshake className="w-4 h-4" /> Partner Network
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-display font-bold mb-6"
                    >
                        Grow With <span className="text-white">Assuvar</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
                    >
                        Join our ecosystem of technology partners, resellers, and integrators.
                    </motion.p>
                </div>
            </section>

            {/* FORM SECTION */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-4xl mx-auto px-6">
                    <GlobalContactForm mode="partner" className="bg-white shadow-xl" />
                </div>
            </section>
        </main>
    );
}
