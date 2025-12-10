'use client';

import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/src/i18n/navigation';
import { IndustryItem } from '@/components/navigation/IndustriesData';

// Helper to render icon by name
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
    // @ts-ignore - Dynamic access to icons
    const IconComponent = LucideIcons[name];
    if (!IconComponent) return null;
    return <IconComponent className={className} />;
};

interface IndustryPageLayoutProps {
    industry: IndustryItem;
    problems: { text: string; icon?: string }[];
    solutions: { title: string; description: string; icon: string }[];
    values: { title: string; icon: string }[];
    trust: { title: string; description: string; icon: string }[];
}

export default function IndustryPageLayout({ industry, problems, solutions, values, trust }: IndustryPageLayoutProps) {
    return (
        <main className="pt-20 bg-white min-h-screen">
            {/* HER0 SECTION */}
            <section className="relative py-24 md:py-32 overflow-hidden bg-white">
                <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-200 via-transparent to-transparent"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-display font-bold text-structura-black mb-6"
                    >
                        {industry.label} <span className="text-structura-black">.</span>
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="h-1 w-24 mx-auto bg-brand-gradient rounded-full mb-8"
                    />
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed"
                    >
                        {industry.description}
                    </motion.p>
                </div>
            </section>

            {/* PROBLEMS WE SOLVE */}
            <section className="py-20 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-2xl font-bold text-structura-black mb-4">The Challenge</h2>
                        <p className="text-slate-500">Overcoming industry-specific hurdles with precision.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {problems.map((prob, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-start gap-4"
                            >
                                <div className="mt-1 w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                                    <ArrowRight className="w-4 h-4" /> {/* Or specific icon if provided */}
                                </div>
                                <span className="text-slate-700 font-medium">{prob.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* OUR SOLUTIONS */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-structura-black mb-4">Tailored Solutions</h2>
                        <div className="h-1 w-12 bg-slate-200 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {solutions.map((sol, idx) => (
                            <div key={idx} className="group p-8 rounded-2xl border border-slate-100 hover:border-transparent hover:shadow-xl hover:shadow-structura-blue/5 transition-all duration-300 relative overflow-hidden bg-white">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-structura-blue to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="w-12 h-12 rounded-lg bg-slate-50 text-structura-blue flex items-center justify-center mb-6 group-hover:bg-structura-blue group-hover:text-white transition-colors duration-300">
                                    <DynamicIcon name={sol.icon} className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-structura-black mb-3">{sol.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{sol.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* VALUE DELIVERED */}
            <section className="py-24 bg-structura-black text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/assets/grid.svg')]"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-12 text-center">
                        {values.map((val, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                                    <DynamicIcon name={val.icon} className="w-8 h-8 opacity-80" />
                                </div>
                                <span className="font-medium text-lg text-slate-300">{val.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TRUST PILLARS (Mini) */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {trust.map((item, idx) => (
                            <div key={idx} className="text-center">
                                <div className="mx-auto w-12 h-12 mb-4 text-structura-blue flex items-center justify-center">
                                    <DynamicIcon name={item.icon} className="w-8 h-8" />
                                </div>
                                <h4 className="font-bold text-structura-black mb-2">{item.title}</h4>
                                <p className="text-xs text-slate-500">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-accent-gradient text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-gradient opacity-10"></div>
                <div className="relative z-10 max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Innovate?</h2>
                    <p className="text-slate-300 text-lg mb-8">
                        Let's discuss how we can build resilient infrastructure for your organization.
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-structura-black font-bold rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        Get Consultation <ArrowRight className="w-5 h-5" />
                    </a>
                </div>
            </section>
        </main>
    );
}
