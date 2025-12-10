'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, RefreshCcw, Handshake, Target, ArrowRight } from 'lucide-react';
import { Link } from '@/src/i18n/navigation';

export default function AboutPage() {
    return (
        <main className="pt-20 bg-white min-h-screen">
            {/* HERO */}
            <section className="relative py-32 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-sm font-bold text-structura-blue uppercase tracking-widest mb-4"
                    >
                        About Assuvar
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-display font-bold text-structura-black mb-8 leading-tight max-w-4xl"
                    >
                        Building the digital <br />
                        <span className="text-structura-black">infrastructure of tomorrow.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-500 max-w-2xl leading-relaxed"
                    >
                        We are an engineering-first consultancy dedicated to clarity, precision, and long-term value.
                    </motion.p>
                </div>
            </section>

            {/* MISSION & VISION */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-structura-blue/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                            <div className="w-12 h-12 rounded-xl bg-structura-black text-white flex items-center justify-center mb-6">
                                <Target className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-structura-black mb-4">Our Mission</h2>
                            <p className="text-slate-600 leading-relaxed">
                                To demystify complex technology and provide robust, scalable, and elegant solutions that empower businesses to operate with confidence and speed.
                            </p>
                        </div>
                        <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gradient opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                            <div className="w-12 h-12 rounded-xl bg-slate-100 text-structura-black flex items-center justify-center mb-6">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-bold text-structura-black mb-4">Our Vision</h2>
                            <p className="text-slate-600 leading-relaxed">
                                A world where enterprise software is synonymous with reliability, speed, and user-centric design—free from technical debt and unnecessary complexity.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TRUST PILLARS */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-structura-black mb-6">Our Core Principles</h2>
                        <div className="h-1 w-16 bg-brand-gradient mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: "Commitment", desc: "We own the outcome, not just the code.", icon: Handshake },
                            { title: "Craftsmanship", desc: "Pixel-perfect, clean code, every time.", icon: Zap },
                            { title: "Reliability", desc: "Systems built to survive & scale.", icon: Shield },
                            { title: "Continuity", desc: "Long-term partnership logic.", icon: RefreshCcw },
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="text-center p-6"
                            >
                                <div className="w-16 h-16 mx-auto bg-slate-50 rounded-full flex items-center justify-center text-structura-blue mb-4">
                                    <item.icon className="w-8 h-8 stroke-[1.5px]" />
                                </div>
                                <h3 className="text-lg font-bold text-structura-black mb-2">{item.title}</h3>
                                <p className="text-sm text-slate-500">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-structura-black relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-gradient-to-l from-structura-blue to-transparent"></div>
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Ready to build with precision?</h2>
                    <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-5 bg-white text-structura-black rounded-full font-bold hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-shadow duration-300">
                        Work with Assuvar <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
