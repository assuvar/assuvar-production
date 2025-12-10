'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Smartphone, Zap, ShieldCheck, Rocket } from 'lucide-react';

const services = [
    {
        id: 'data-analytics',
        title: 'DATA & ANALYTICS',
        headline: 'Turn Data Into Actionable Business Intelligence',
        description: 'Dashboards, insights, predictions, and AI-driven analytics that help companies make faster, smarter decisions.',
        icon: BarChart3
    },
    {
        id: 'product-engineering',
        title: 'PRODUCT ENGINEERING',
        headline: 'Modern Web & App Development for Growing Companies',
        description: 'We build scalable digital products, websites, mobile apps, and platforms that match your business goals.',
        icon: Smartphone
    },
    {
        id: 'intelligent-automation',
        title: 'INTELLIGENT AUTOMATION',
        headline: 'Automate Manual Work & Boost Efficiency',
        description: 'Low-code workflows, RPA, smart process automation, and AI tools that save time and reduce human effort.',
        icon: Zap
    },
    {
        id: 'quality-engineering',
        title: 'QUALITY ENGINEERING',
        headline: 'Test, Validate & Scale Your Systems With Confidence',
        description: 'Manual testing, automation, performance, LLM testing, and cloud testing — ensuring reliability at every level.',
        icon: ShieldCheck
    },
    {
        id: 'accelerators',
        title: 'ACCELERATORS',
        headline: 'Quick-Start Tools To Launch Digital Initiatives Faster',
        description: 'Pre-built components, AI templates, automation kits, and rapid deployment tools for fast execution.',
        icon: Rocket
    }
];

export default function ServicesTimeline() {
    const [activeindex, setActiveIndex] = useState(0);

    // Auto-rotation logic
    useEffect(() => {
        const intervalDuration = 7000; // 7 seconds per cycle

        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % services.length);
        }, intervalDuration);

        return () => clearInterval(timer);
    }, [activeindex]); // dependencies reset timer on index change

    // Manual click handler
    const handleManualClick = (index: number) => {
        setActiveIndex(index);
    };

    const activeService = services[activeindex];

    return (
        <section className="py-24 bg-slate-50 border-y border-structura-border overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">

                    {/* LEFT SIDE: Auto-changing content */}
                    <div className="lg:col-span-7 relative min-h-[400px] flex items-center">
                        <motion.div
                            key={activeindex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="w-full"
                        >
                            <div className="mb-8">
                                {/* Large SVG Illustration Placeholder - Using Lucide for now, styled as requested */}
                                <div className="w-[140px] h-[140px] rounded-3xl bg-gradient-to-br from-white to-slate-100 border border-structura-border shadow-2xl flex items-center justify-center mb-8 relative group">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-structura-blue/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <activeService.icon
                                        className="w-16 h-16 text-transparent stroke-[1.5]"
                                        style={{
                                            stroke: "url(#gradient-stroke)",
                                            filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.1))"
                                        }}
                                    />
                                    {/* SVG Gradient Definition */}
                                    <svg width="0" height="0" className="absolute">
                                        <linearGradient id="gradient-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#11131F" />
                                            <stop offset="30%" stopColor="#11131F" />
                                            <stop offset="100%" stopColor="#6767FD" />
                                        </linearGradient>
                                    </svg>
                                </div>

                                <h3 className="text-sm font-bold text-structura-blue uppercase tracking-widest mb-4">
                                    {activeService.title}
                                </h3>
                                <h2 className="text-3xl md:text-5xl font-bold font-display text-structura-black mb-6 leading-tight">
                                    {activeService.headline}
                                </h2>
                                <p className="text-xl text-slate-500 leading-relaxed max-w-xl mb-8">
                                    {activeService.description}
                                </p>

                                {/* Horizontal Timeline Indicator */}
                                <div className="w-full max-w-xl h-1 bg-structura-border rounded-full overflow-hidden">
                                    <motion.div
                                        key={activeindex}
                                        className="h-full bg-brand-gradient"
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ ease: "linear", duration: 7 }} // Smooth updates matched to interval
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT SIDE: Fixed Menu */}
                    <div className="lg:col-span-5 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-structura-border"></div>
                        {/* Animated Progress Bar Indicator on the line */}
                        <motion.div
                            className="absolute left-0 w-[2px] bg-brand-gradient z-10"
                            initial={{ top: 0, height: 0 }}
                            animate={{
                                top: `${activeindex * 20}%`,
                                height: '20%'
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />

                        <div className="flex flex-col h-full font-display">
                            {services.map((service, index) => (
                                <button
                                    key={service.id}
                                    onClick={() => handleManualClick(index)}
                                    className={`text-left py-6 pl-8 pr-4 transition-all duration-300 relative group ${index === activeindex
                                        ? 'text-structura-black'
                                        : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    <h4 className={`text-xl font-bold transition-transform duration-300 ${index === activeindex ? 'translate-x-2' : 'group-hover:translate-x-1'
                                        }`}>
                                        {service.title}
                                    </h4>
                                    {/* Optional: Add small progress bar per item if needed, currently using main vertical line */}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
