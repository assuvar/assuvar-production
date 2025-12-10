'use client';

import { useState, useEffect, useRef } from 'react';
import { Handshake, Shield, Compass, Clock, CheckCircle2, Infinity as InfinityIcon, Users, HardDrive, Lock, Cloud, Zap, Layers, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Methodology() {
    const [currentStep, setCurrentStep] = useState(0);
    const totalSteps = 4;
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

    // 2. FIX TIMELINE AUTO-CYCLE (7 SECONDS)
    useEffect(() => {
        const startAutoPlay = () => {
            // Clear existing to avoid dupes
            if (autoPlayRef.current) clearInterval(autoPlayRef.current);

            autoPlayRef.current = setInterval(() => {
                setCurrentStep((prev) => (prev + 1) % totalSteps);
            }, 7000);
        };

        startAutoPlay();

        return () => {
            if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        };
    }, [currentStep]); // Restart timer on step change

    const setStep = (stepIndex: number) => {
        setCurrentStep(stepIndex);
        // Interval automatically resets due to dependency on currentStep
    };

    const timelineItems = [
        {
            title: 'Commitment',
            description: 'We begin with absolute clarity — defining goals, expectations, timelines, and measurable results. Full visibility and open communication at every stage.',
            icons: [Handshake, Shield]
        },
        {
            title: 'Craftsmanship',
            description: 'Our solutions are engineered with precision using modern tools, clean design, and best practices to ensure long-term scalability.',
            icons: [Compass]
        },
        {
            title: 'Reliability',
            description: 'We deliver consistently, meet timelines, and ensure everything works exactly as promised — no surprises, no delays.',
            icons: [Clock, CheckCircle2]
        },
        {
            title: 'Continuity',
            description: 'We don’t stop at delivery. We support, maintain, and optimize your systems continuously to ensure lasting value.',
            icons: [InfinityIcon]
        }
    ];

    // Card Components (Unchanged logic, ensuring keys/rendering)
    const CommitmentCard = () => (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold font-display text-structura-black">Strategic Alignment</h3>
                <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1 border border-blue-100">
                    <Handshake className="w-3 h-3" />
                    Partnership
                </div>
            </div>
            <div className="space-y-4 flex-1">
                {[
                    { text: "Business Goals Defined", delay: 0 },
                    { text: "Scope & Timeline Locked", delay: 0.1 },
                    { text: "Tech Stack Selection", delay: 0.2 },
                    { text: "Success Metrics Agreed", delay: 0.3 }
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: item.delay + 0.2 }}
                        className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100"
                    >
                        <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-green-500">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-slate-700">{item.text}</span>
                    </motion.div>
                ))}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                <span>Phase 01</span>
                <span>Foundational Clarity</span>
            </div>
        </div>
    );

    const CraftsmanshipCard = () => (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold font-display text-structura-black">Engineering Excellence</h3>
                <div className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold flex items-center gap-1 border border-purple-100">
                    <Code2 className="w-3 h-3" />
                    Clean Code
                </div>
            </div>
            <div className="flex-1 relative bg-slate-900 rounded-xl p-4 overflow-hidden font-mono text-sm text-slate-300">
                <div className="absolute top-0 left-0 w-full h-8 bg-slate-800 flex items-center gap-2 px-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="mt-6 space-y-2">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                        <span className="text-purple-400">interface</span> <span className="text-yellow-400">ScalableSystem</span> {'{'}
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="pl-4">
                        security: <span className="text-green-400">SecurityProtocol</span>;
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="pl-4">
                        performance: <span className="text-green-400">Optimized</span>;
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="pl-4">
                        maintenance: <span className="text-blue-400">Automated</span>;
                    </motion.div>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
                        {'}'}
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "100%" }}
                        transition={{ delay: 1.2, duration: 0.5 }}
                        className="mt-4 h-1 bg-green-500 rounded-full"
                    />
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="text-xs text-green-500 mt-1">
                        Build Successful (24ms)
                    </motion.div>
                </div>
            </div>
        </div>
    );

    const ReliabilityCard = () => (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold font-display text-structura-black">Trust Metrics</h3>
                <div className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 border border-green-100">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                </div>
            </div>
            <motion.div
                className="space-y-4 flex-1"
                variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
                }}
                initial="hidden"
                animate="show"
            >
                {[
                    { label: "On-Time Delivery", value: "98%", Icon: Clock },
                    { label: "Project Satisfaction", value: "4.9", sub: "/5", Icon: CheckCircle2 },
                    { label: "Support Response", value: "<1 hour", Icon: Users },
                    { label: "Repeat Clients", value: "72%", Icon: InfinityIcon }
                ].map((metric, idx) => (
                    <motion.div
                        key={idx}
                        variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-md hover:border-blue-100 group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm text-structura-blue group-hover:scale-110 transition-transform">
                                <metric.Icon className="w-4 h-4" style={{ stroke: "url(#brand-gradient)" }} />
                            </div>
                            <span className="font-medium text-slate-600 text-sm">{metric.label}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-xl font-bold text-structura-black">{metric.value}</span>
                            {metric.sub && <span className="text-xs text-slate-400 font-medium">{metric.sub}</span>}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );

    const ContinuityCard = () => (
        <div className="h-full flex flex-col justify-center">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold font-display text-structura-black">Continuous Evolution</h3>
                <div className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-bold flex items-center gap-1 border border-orange-100">
                    <InfinityIcon className="w-3 h-3" />
                    Infinite
                </div>
            </div>

            <div className="relative flex-1 flex items-center justify-center">
                {/* Svg Infinity Animation */}
                <div className="relative w-48 h-24">
                    <svg viewBox="0 0 200 100" className="w-full h-full">
                        <path
                            d="M50,50 C20,50 20,20 50,20 C80,20 80,50 100,50 C120,50 120,80 150,80 C180,80 180,50 150,50 C120,50 120,20 100,20 C80,20 80,50 50,50 Z"
                            fill="none"
                            stroke="#E2E8F0"
                            strokeWidth="4"
                        />
                        <motion.path
                            d="M50,50 C20,50 20,20 50,20 C80,20 80,50 100,50 C120,50 120,80 150,80 C180,80 180,50 150,50 C120,50 120,20 100,20 C80,20 80,50 50,50 Z"
                            fill="none"
                            stroke="url(#brand-gradient)"
                            strokeWidth="4"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                    </svg>

                    {/* Floating Icons */}
                    <motion.div
                        className="absolute top-0 left-10 p-2 bg-white rounded-lg shadow-md border border-slate-100 text-xs font-bold text-slate-600 flex items-center gap-1"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <Zap className="w-3 h-3 text-yellow-500" /> Optimize
                    </motion.div>
                    <motion.div
                        className="absolute bottom-0 right-10 p-2 bg-white rounded-lg shadow-md border border-slate-100 text-xs font-bold text-slate-600 flex items-center gap-1"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                    >
                        <Layers className="w-3 h-3 text-blue-500" /> Scale
                    </motion.div>
                </div>
            </div>
            <p className="text-center text-slate-500 mt-4 max-w-xs mx-auto text-sm">
                Regular updates, security patching, and performance tuning to keep you ahead.
            </p>
        </div>
    );

    const renderCard = () => {
        switch (currentStep) {
            case 0: return <CommitmentCard />;
            case 1: return <CraftsmanshipCard />;
            case 2: return <ReliabilityCard />;
            case 3: return <ContinuityCard />;
            default: return <CommitmentCard />;
        }
    };

    return (
        <>
            <section className="py-24 bg-white border-y border-structura-border overflow-hidden relative z-10" id="methodology">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <span className="text-xs font-bold text-structura-black border border-structura-border px-3 py-1 rounded-full uppercase tracking-wider bg-slate-50">The Assuvar Promise</span>
                        <h2 className="text-3xl md:text-5xl font-bold font-display mt-6 text-structura-black">Building Trust Through Precision & Performance</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                        {/* Left: Interactive List */}
                        <div className="space-y-6" id="timeline-list">
                            {timelineItems.map((item, index) => (
                                <div
                                    key={index}
                                    className={`timeline-tab p-6 rounded-r-xl border-l-4 cursor-pointer transition-all duration-300 relative ${currentStep === index
                                        ? 'bg-slate-50 border-transparent shadow-sm'
                                        : 'border-transparent hover:bg-slate-50/50'
                                        }`}
                                    onClick={() => setStep(index)}
                                >
                                    {/* 4. FIX LEFT-SIDE ACTIVE INDICATOR BAR */}
                                    {currentStep === index && (
                                        <motion.div
                                            layoutId="active-indicator"
                                            className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full"
                                            style={{ background: 'linear-gradient(135deg, #11131F 0%, #6767FD 100%)' }}
                                            transition={{ duration: 0.45, ease: "easeInOut" }}
                                        />
                                    )}

                                    <div className="flex items-center gap-3 mb-2 relative">
                                        <div className={`p-2 rounded-lg relative`}>
                                            <div className="flex -space-x-1 relative z-10">
                                                {item.icons.map((Icon, i) => (
                                                    // 3. FIX SVG ANIMATION
                                                    <Icon
                                                        key={i}
                                                        className="w-5 h-5 transition-all duration-300"
                                                        strokeWidth={2.2}
                                                        style={{
                                                            stroke: currentStep === index ? '#6767FD' : 'rgba(0,0,0,0.35)',
                                                            opacity: currentStep === index ? 1 : 0.45,
                                                            transform: currentStep === index ? 'scale(1.05)' : 'scale(1)',
                                                            filter: currentStep === index ? 'drop-shadow(0 0 4px rgba(103,103,253,0.3))' : 'none'
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <h4 className={`text-xl font-bold font-display transition-colors duration-300 ${currentStep === index ? 'text-structura-black' : 'text-slate-500'}`}>
                                            {item.title}
                                        </h4>
                                    </div>
                                    <motion.div
                                        initial={false}
                                        animate={{ height: currentStep === index ? 'auto' : 0, opacity: currentStep === index ? 1 : 0 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="text-slate-500 text-sm leading-relaxed pl-[3.25rem] transition-colors duration-300 pb-2">
                                            {item.description}
                                        </p>
                                    </motion.div>
                                    {currentStep === index && (
                                        <div className="mt-2 ml-[3.25rem] h-1 bg-slate-200 rounded-full overflow-hidden w-full max-w-[200px]">
                                            <motion.div
                                                key={index} // Reset animation on active
                                                className="h-full bg-brand-gradient"
                                                initial={{ width: 0 }}
                                                animate={{ width: "100%" }}
                                                transition={{ duration: 7, ease: "linear" }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Right: Dynamic Cards */}
                        <div className="relative sticky top-24 min-h-[420px]">
                            {/* SVG Definitions */}
                            <svg width="0" height="0" className="absolute">
                                <linearGradient id="brand-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#11131F" />
                                    <stop offset="100%" stopColor="#6767FD" />
                                </linearGradient>
                            </svg>

                            {/* 5. FIX RIGHT-SIDE CONTENT SWITCHING & 7. FIX SECTION SHADOW */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    className="bg-white rounded-[24px] p-8 md:p-10 relative overflow-hidden h-full w-full"
                                    style={{ boxShadow: '0px 12px 40px rgba(0,0,0,0.08)' }}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                >
                                    {/* Gradient strip */}
                                    <div
                                        className="absolute top-0 left-0 w-full"
                                        style={{
                                            background: 'linear-gradient(135deg, #11131F 0%, #6767FD 100%)',
                                            height: '6px'
                                        }}
                                    ></div>
                                    {renderCard()}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>

            {/* Integration Section */}
            <section className="py-24 bg-structura-light overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <div className="inline-block px-3 py-1 bg-white border border-structura-border rounded text-xs font-bold text-slate-500 mb-6 shadow-sm">
                            INTEGRATION ORBIT
                        </div>
                        <h2 className="text-4xl font-bold font-display text-structura-black mb-6">Connecting your people, hardware, and data.</h2>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            Eliminate data silos. Structura acts as the central nervous system for your IT operations, syncing HR, Finance, and Engineering data streams into one cohesive truth.
                        </p>

                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div className="w-6 h-6 mt-1 rounded-full bg-structura-blue/10 flex items-center justify-center flex-shrink-0">
                                    <div className="w-2 h-2 rounded-full bg-structura-blue"></div>
                                </div>
                                <div>
                                    <h5 className="font-bold text-structura-black">Real-time Asset Tracking</h5>
                                    <p className="text-sm text-slate-500 mt-1">Know exactly where every server and laptop is.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-6 h-6 mt-1 rounded-full bg-structura-blue/10 flex items-center justify-center flex-shrink-0">
                                    <div className="w-2 h-2 rounded-full bg-structura-blue"></div>
                                </div>
                                <div>
                                    <h5 className="font-bold text-structura-black">Automated Onboarding</h5>
                                    <p className="text-sm text-slate-500 mt-1">Provision devices and accounts in seconds, not days.</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="relative h-[500px] flex items-center justify-center">
                        <div className="absolute z-20">
                            <div className="w-28 h-28 bg-structura-black rounded-3xl shadow-2xl flex items-center justify-center border-[6px] border-white relative">
                                <span className="text-white font-display font-bold text-xl">HUB</span>
                                <div className="absolute -inset-4 bg-structura-blue/20 rounded-3xl -z-10 animate-pulse"></div>
                            </div>
                        </div>

                        <div className="absolute w-[450px] h-[450px] border border-dashed border-slate-300 rounded-full animate-spin-slow opacity-60"></div>
                        <div className="absolute w-[300px] h-[300px] border border-slate-200 rounded-full animate-spin-reverse opacity-60"></div>

                        <div className="absolute w-[450px] h-[450px] animate-spin-slow pointer-events-none">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-xl shadow-lg border border-structura-border flex items-center gap-2">
                                <Users className="w-4 h-4 text-structura-blue" />
                                <span className="text-xs font-bold text-structura-black">HRIS</span>
                            </div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-white p-3 rounded-xl shadow-lg border border-structura-border flex items-center gap-2">
                                <HardDrive className="w-4 h-4 text-structura-amber" />
                                <span className="text-xs font-bold text-structura-black">MDM</span>
                            </div>
                        </div>

                        <div className="absolute w-[300px] h-[300px] animate-spin-reverse pointer-events-none">
                            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-lg shadow-md border border-structura-border">
                                <Lock className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-lg shadow-md border border-structura-border">
                                <Cloud className="w-4 h-4 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
