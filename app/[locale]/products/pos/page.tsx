'use client';

import { motion } from 'framer-motion';
import { Check, ArrowRight, Cloud, Smartphone, Zap, Shield, BarChart3, Clock } from 'lucide-react';
import { Link } from '@/src/i18n/navigation';
import Image from 'next/image';

export default function PosProductPage() {
    return (
        <main className="bg-white min-h-screen pt-20">
            {/* HERO */}
            <section className="relative py-24 bg-accent-gradient text-white overflow-hidden text-center">
                <div className="absolute inset-0 bg-brand-gradient opacity-20"></div>
                <div className="relative z-10 max-w-5xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-bold mb-8"
                    >
                        <Zap className="w-4 h-4 text-yellow-400" /> V2.0 Now Available
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight"
                    >
                        The OS for Modern Retail.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto mb-12"
                    >
                        Assuvar POS is more than a register. It&apos;s a cloud-native engine that unifies sales, inventory, and customer data in real-time.
                    </motion.p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/contact?type=demo-request&product=POS" className="px-8 py-4 bg-white text-structura-black rounded-lg font-bold hover:bg-slate-50 hover:shadow-xl transition-all flex items-center gap-2">
                            Get Demo <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link href="#features" className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-lg font-bold hover:bg-white/10 transition-all">
                            View Features
                        </Link>
                    </div>
                </div>
            </section>

            {/* SCREENSHOTS / MOCKUP */}
            <section className="relative -mt-20 z-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="rounded-2xl border-8 border-slate-900 bg-slate-900 shadow-2xl overflow-hidden aspect-[16/9] relative flex items-center justify-center"
                    >
                        {/* Placeholder for Screenshot */}
                        <div className="absolute inset-0 bg-slate-800 flex flex-col items-center justify-center p-12 text-center text-slate-500 gap-4">
                            <span className="text-6xl font-display font-bold text-slate-700">POS UI</span>
                            <p>High-fidelity dashboard placeholder <br /> (Requires generated assets)</p>
                            {/* In real dev, we would put an Image component here */}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FEATURES GRID */}
            <section id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-structura-black mb-6">Built for Speed. Scaled for Growth.</h2>
                        <p className="text-xl text-slate-500 max-w-2xl mx-auto">Everything you need to run your business, engineered into one fluid interface.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Cloud Sync", icon: Cloud, desc: "Changes made on one device reflect instantly across all locations. Offline mode included." },
                            { title: "Mobile First", icon: Smartphone, desc: "Run your entire store from a tablet. Full functionality on iOS and Android." },
                            { title: "Enterprise Security", icon: Shield, desc: "Bank-grade encryption and role-based access control standard on all plans." },
                            { title: "Real-time Analytics", icon: BarChart3, desc: "Live sales dashboards and automated end-of-day reporting." },
                            { title: "Inventory Control", icon: Check, desc: "Automated stock alerts, transfer management, and vendor automated POs." },
                            { title: "Shift Management", icon: Clock, desc: "Clock-in/out, performance tracking, and commission calculation built-in." },
                        ].map((feature, idx) => (
                            <div key={idx} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-structura-blue/30 transition-colors">
                                <feature.icon className="w-10 h-10 text-structura-blue mb-6" />
                                <h3 className="text-xl font-bold text-structura-black mb-3">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CLOUD SYNC EXPLANATION */}
            <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Always On. Always Synced.</h2>
                        <p className="text-slate-300 text-lg leading-relaxed mb-8">
                            Assuvar POS uses a distributed ledger architecture to ensure your data is never lost, even if your internet goes down. Transactions queue locally and sync milliseconds after reconnection.
                        </p>
                        <ul className="space-y-4">
                            {["99.99% Uptime Guarantee", "Conflict-free Data Resolution", "Automatic Backups"].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 font-semibold">
                                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-slate-900"><Check className="w-4 h-4" /></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                        {/* Visual representation of sync */}
                        <div className="flex justify-between items-center text-center">
                            <div>
                                <Smartphone className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                                <div className="text-xs uppercase font-bold text-slate-500">Terminal A</div>
                            </div>
                            <div className="flex-1 px-4">
                                <div className="h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent relative">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-500 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full">SYNCING</div>
                                </div>
                            </div>
                            <div>
                                <Cloud className="w-16 h-16 text-structura-blue mx-auto mb-2 icon-pulse" />
                                <div className="text-xs uppercase font-bold text-structura-blue">Assuvar Cloud</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-white text-center">
                <div className="max-w-3xl mx-auto px-6 featured-box p-12 rounded-3xl bg-slate-50 border border-slate-100">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-structura-black mb-6">Ready to upgrade your infrastructure?</h2>
                    <p className="text-slate-500 text-lg mb-10">Join thousands of retailers powering their growth with Assuvar.</p>
                    <Link href="/contact?type=demo-request&product=POS" className="inline-flex items-center gap-2 px-8 py-4 bg-accent-gradient text-white rounded-lg font-bold hover:shadow-xl transition-all">
                        Get Demo <ArrowRight className="w-4 h-4" />
                    </Link>
                    <p className="mt-6 text-xs text-slate-400">Cloud Version Only. Hardware sold separately.</p>
                </div>
            </section>
        </main>
    );
}
