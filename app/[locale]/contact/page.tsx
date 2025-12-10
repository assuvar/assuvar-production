'use client';

import { motion } from 'framer-motion';
import GlobalContactForm from '@/components/GlobalContactForm';

export default function ContactPage() {
    return (
        <main className="pt-20 bg-white min-h-screen">
            {/* HERO */}
            <section className="relative py-20 bg-accent-gradient overflow-hidden text-center text-white">
                <div className="absolute inset-0 z-0 bg-brand-gradient opacity-10"></div>

                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-display font-bold mb-6"
                    >
                        Let&apos;s Build <span className="text-white">Something Great.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
                    >
                        From intelligent automation to complex data engineering, we have the expertise to scale your vision.
                    </motion.p>
                </div>
            </section>

            {/* FORM CONTAINER */}
            <section className="py-20 bg-slate-50 -mt-10">
                <div className="max-w-5xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <GlobalContactForm mode="client" className="shadow-2xl border-slate-200" />
                    </motion.div>

                    {/* FAQ / INFO SECTION */}
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-6">
                            <h4 className="font-bold text-structura-black mb-2">Technical Consultation</h4>
                            <p className="text-sm text-slate-500">We start every engagement with a deep-dive architecture review.</p>
                        </div>
                        <div className="p-6">
                            <h4 className="font-bold text-structura-black mb-2">Agile Delivery</h4>
                            <p className="text-sm text-slate-500">Two-week sprints, transparent reporting, and continuous CI/CD.</p>
                        </div>
                        <div className="p-6">
                            <h4 className="font-bold text-structura-black mb-2">Post-Launch Support</h4>
                            <p className="text-sm text-slate-500">Reliability engineering and 24/7 monitoring packages available.</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
