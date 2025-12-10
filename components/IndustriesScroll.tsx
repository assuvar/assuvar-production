'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView, Easing } from 'framer-motion';
import { ShoppingCart, Factory, Building, HeartPulse, GraduationCap, Users } from 'lucide-react';

const industries = [
    {
        id: 'retail',
        title: 'Retail & Ecommerce',
        headline: 'Smarter Operations. Seamless Customer Experience.',
        description: 'Automation, analytics, and AI tools that boost sales, simplify operations, and enhance buyer journeys.',
        icon: ShoppingCart,
        color: 'from-blue-500 to-cyan-400'
    },
    {
        id: 'manufacturing',
        title: 'Manufacturing',
        headline: 'Optimized Production Through Digital Intelligence.',
        description: 'From workflow automation to AI-driven quality checks, we help factories run smoother and smarter.',
        icon: Factory,
        color: 'from-orange-500 to-red-400'
    },
    {
        id: 'real-estate',
        title: 'Real Estate',
        headline: 'Modern Property Management & Customer Automation.',
        description: 'Automated lead handling, digital listing systems, and customized CRM workflows for real estate teams.',
        icon: Building,
        color: 'from-emerald-500 to-green-400'
    },
    {
        id: 'healthcare',
        title: 'Healthcare',
        headline: 'Efficient Systems for Modern Patient Care.',
        description: 'Appointment automation, document AI, workflow management, and secure digital support systems.',
        icon: HeartPulse,
        color: 'from-rose-500 to-pink-400'
    },
    {
        id: 'education',
        title: 'Education',
        headline: 'Digital Tools That Enhance Learning & Administration.',
        description: 'LMS platforms, automation for attendance/fees, AI-assisted learning, and performance dashboards.',
        icon: GraduationCap,
        color: 'from-yellow-400 to-amber-500'
    },
    {
        id: 'agencies',
        title: 'Agencies & Service Companies',
        headline: 'Automation-Driven Growth for Creative & Service Teams.',
        description: 'Lead automation, proposal generation, project workflows, and client portals.',
        icon: Users,
        color: 'from-purple-500 to-indigo-400'
    }
];

// Easing curve for premium feel
const premiumEase: Easing = [0.22, 1, 0.36, 1];

function IndustryCard({ item, index }: { item: any, index: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { margin: "-20% 0px -20% 0px", once: false });

    return (
        <div ref={ref} className="min-h-[60vh] flex items-center mb-24 last:mb-0">
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0.2, x: 50 }}
                transition={{ duration: 0.8, ease: premiumEase }}
                className={`p-8 md:p-12 rounded-3xl bg-white border border-structura-border shadow-xl hover:shadow-2xl transition-shadow w-full relative overflow-hidden group`}
            >
                <div className={`absolute top-0 right-0 w-64 h-64 bg-brand-gradient opacity-[0.03] rounded-bl-full pointer-events-none group-hover:opacity-[0.08] transition-opacity duration-500`}></div>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Animated Icon Section */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                        {/* Particle Morph Effect Simulation */}
                        <motion.div
                            className={`absolute inset-0 bg-brand-gradient opacity-10 rounded-2xl`}
                            animate={isInView ? { scale: [0.8, 1.1, 1], rotate: [0, 5, 0] } : {}}
                            transition={{ duration: 1.2, ease: premiumEase }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <item.icon className="w-10 h-10 text-structura-black" />
                        </div>

                        {/* "Particles" */}
                        {[...Array(4)].map((_, i) => (
                            <motion.div
                                key={i}
                                className={`absolute w-1.5 h-1.5 rounded-full bg-brand-gradient`}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={isInView ? {
                                    opacity: [0, 1, 0],
                                    scale: [0, 1, 0],
                                    x: Math.cos(i * 90) * 40,
                                    y: Math.sin(i * 90) * 40
                                } : {}}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                    ease: "easeInOut"
                                }}
                                style={{ top: '50%', left: '50%', marginTop: -3, marginLeft: -3 }}
                            />
                        ))}
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-structura-blue uppercase tracking-widest mb-3">
                            {item.title}
                        </h3>
                        <h2 className="text-2xl md:text-3xl font-bold font-display text-structura-black mb-4 leading-tight">
                            {item.headline}
                        </h2>
                        <p className="text-lg text-slate-500 leading-relaxed">
                            {item.description}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function IndustriesScroll() {
    return (
        <section className="py-32 bg-slate-50 relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                    {/* Fixed Left Side */}
                    <div className="lg:col-span-5 relative">
                        <div className="sticky top-32">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, ease: premiumEase }}
                            >
                                <span className="inline-block px-3 py-1 rounded-full bg-structura-blue/10 text-structura-blue text-xs font-bold uppercase tracking-wider mb-6">
                                    Industries We Serve
                                </span>
                                <h2 className="text-4xl md:text-6xl font-bold font-display text-structura-black mb-8 leading-tight">
                                    Transforming Industries With <span className="text-structura-black">Next-Gen Digital Innovation</span>
                                </h2>
                                <p className="text-xl text-slate-500 leading-relaxed max-w-lg mb-12">
                                    Our solutions adapt to the unique needs of each sector—combining AI, automation, and modern engineering to create real impact.
                                </p>

                                {/* Decoration */}
                                <div className="h-1 w-24 bg-gradient-to-r from-structura-blue to-purple-500 rounded-full"></div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Scrollable Right Side */}
                    <div className="lg:col-span-7">
                        <div className="flex flex-col">
                            {industries.map((item, index) => (
                                <IndustryCard key={item.id} item={item} index={index} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
