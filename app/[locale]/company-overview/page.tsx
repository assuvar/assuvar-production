'use client';

import { motion } from 'framer-motion';
import { Building2, Globe, Users, Award, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from '@/src/i18n/navigation';

export default function CompanyOverviewPage() {
    return (
        <main className="pt-20 bg-white min-h-screen">
            {/* HERO */}
            <section className="relative py-24 bg-slate-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1">
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl md:text-5xl font-display font-bold text-structura-black mb-6"
                            >
                                Company <span className="text-structura-black">Overview</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-lg text-slate-600 leading-relaxed max-w-xl"
                            >
                                Assuvar is a premier technology consultancy specializing in high-performance web engineering, cloud architecture, and digital transformation.
                            </motion.p>
                        </div>
                        <div className="flex-1 w-full">
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: "Our Focus", value: "Digital Scale", icon: Building2 },
                                    { label: "Our Reach", value: "Global Impact", icon: Globe },
                                    { label: "Our Team", value: "Expert Engineers", icon: Users },
                                    { label: "Our Promise", value: "Measurable Results", icon: Award },
                                ].map((stat, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                                        <stat.icon className="w-6 h-6 text-structura-blue mb-3" />
                                        <div className="text-xl font-bold text-structura-black">{stat.value}</div>
                                        <div className="text-xs text-slate-500 uppercase tracking-widest">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHAT WE DO */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-1">
                            <h2 className="text-3xl font-bold text-structura-black mb-6">What We Do</h2>
                            <p className="text-slate-500 leading-relaxed mb-6">
                                We bridge the gap between complex business requirements and elegant technical solutions. Our approach is rooted in engineering excellence and strategic foresight.
                            </p>
                            <Link href="/services" className="text-structura-blue font-bold flex items-center gap-2 hover:gap-3 transition-all">
                                View Services <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                "Custom Software Development",
                                "Cloud Infrastructure Migration",
                                "AI & Machine Learning Integration",
                                "Enterprise UX/UI Design",
                                "Legacy System Modernization",
                                "DevOps & CI/CD Automation"
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                                    <span className="text-lg font-medium text-slate-700">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* INDUSTRIES SERVED (Quick List) */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-2xl font-bold mb-12 opacity-90">Trusted by leaders in</h2>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                        {["Finance", "Healthcare", "Retail", "Manufacturing", "Education", "Real Estate"].map((ind) => (
                            <div key={ind} className="px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors cursor-default">
                                {ind}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CONTACT MINI */}
            <section className="py-24 bg-white text-center">
                <div className="max-w-2xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-structura-black mb-6">Partner with Assuvar</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-lg mx-auto">
                        <div className="p-6 bg-slate-50 rounded-xl">
                            <h4 className="font-bold text-structura-black mb-2">General Inquiries</h4>
                            <p className="text-slate-500 text-sm">team@assuvar.com</p>
                            <p className="text-slate-500 text-sm">+91 6382043432</p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-xl">
                            <h4 className="font-bold text-structura-black mb-2">Headquarters</h4>
                            <p className="text-slate-500 text-sm">Bangalore, Karnataka, India</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
