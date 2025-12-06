'use client';

import { useState, useEffect, useRef } from 'react';
import { ClipboardList, AlertTriangle, Compass, Check, Server, GitCommit, TestTube, Rocket, Users, HardDrive, Lock, Cloud } from 'lucide-react';

export default function Methodology() {
    const [currentStep, setCurrentStep] = useState(0);
    const totalSteps = 4;
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

    const setStep = (stepIndex: number) => {
        setCurrentStep(stepIndex);
        // Reset Interval on Manual Click
        if (autoPlayRef.current) {
            clearInterval(autoPlayRef.current);
        }
        autoPlayRef.current = setInterval(nextStep, 5000);
    };

    const nextStep = () => {
        setCurrentStep((prev) => (prev + 1) % totalSteps);
    };

    useEffect(() => {
        autoPlayRef.current = setInterval(nextStep, 5000);
        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current);
            }
        };
    }, []);

    return (
        <>
            <section className="py-24 bg-white border-y border-structura-border overflow-hidden" id="methodology">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <span className="text-xs font-bold text-structura-black border border-structura-border px-3 py-1 rounded-full uppercase tracking-wider bg-slate-50">The Structura Method</span>
                        <h2 className="text-3xl md:text-4xl font-bold font-display mt-6">From Assessment to Optimization</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Left: Interactive List */}
                        <div className="space-y-6" id="timeline-list">
                            {/* Step 1 */}
                            <div
                                className={`timeline-tab p-6 rounded-r-xl border-l-4 border-transparent cursor-pointer hover:bg-slate-50 ${currentStep === 0 ? 'active' : ''}`}
                                onClick={() => setStep(0)}
                            >
                                <h4 className="text-xl font-bold font-display text-structura-black">Assess</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">We conduct a deep-dive audit of your current infrastructure, identifying bottlenecks, security gaps, and technical debt.</p>
                                <div className="progress-bar-bg"><div className="progress-fill"></div></div>
                            </div>

                            {/* Step 2 */}
                            <div
                                className={`timeline-tab p-6 rounded-r-xl border-l-4 border-transparent cursor-pointer hover:bg-slate-50 ${currentStep === 1 ? 'active' : ''}`}
                                onClick={() => setStep(1)}
                            >
                                <h4 className="text-xl font-bold font-display text-structura-black">Architect</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">Designing the blueprint for a resilient, scalable future state using modern cloud-native patterns.</p>
                                <div className="progress-bar-bg"><div className="progress-fill"></div></div>
                            </div>

                            {/* Step 3 */}
                            <div
                                className={`timeline-tab p-6 rounded-r-xl border-l-4 border-transparent cursor-pointer hover:bg-slate-50 ${currentStep === 2 ? 'active' : ''}`}
                                onClick={() => setStep(2)}
                            >
                                <h4 className="text-xl font-bold font-display text-structura-black">Deploy</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">Seamless implementation with zero-downtime migration strategies and automated CI/CD rollouts.</p>
                                <div className="progress-bar-bg"><div className="progress-fill"></div></div>
                            </div>

                            {/* Step 4 */}
                            <div
                                className={`timeline-tab p-6 rounded-r-xl border-l-4 border-transparent cursor-pointer hover:bg-slate-50 ${currentStep === 3 ? 'active' : ''}`}
                                onClick={() => setStep(3)}
                            >
                                <h4 className="text-xl font-bold font-display text-structura-black">Optimize</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">Continuous monitoring, AI-driven performance tuning, and automated cost governance.</p>
                                <div className="progress-bar-bg"><div className="progress-fill"></div></div>
                            </div>
                        </div>

                        {/* Right: Changing Visual Card */}
                        <div className="relative h-[450px] bg-structura-light rounded-3xl border border-structura-border overflow-hidden shadow-2xl">
                            <div className="absolute inset-0 bg-grid-pattern opacity-50"></div>

                            {/* Card 1: Assess (Audit) */}
                            <div className={`feature-card p-10 flex flex-col justify-between h-full ${currentStep === 0 ? 'active' : ''}`} id="card-0">
                                <div className="flex justify-between items-start">
                                    <div className="p-3 bg-white rounded-xl shadow-sm border border-structura-border">
                                        <ClipboardList className="w-8 h-8 text-structura-blue" />
                                    </div>
                                    <div className="text-xs font-mono text-slate-400 bg-white px-2 py-1 rounded border border-structura-border">AUDIT_LOG_INIT</div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                                    <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                                    <div className="h-2 bg-slate-200 rounded w-full"></div>
                                </div>
                                <div className="bg-white p-6 rounded-xl border border-structura-border shadow-lg">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                                            <AlertTriangle className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-structura-black">Vulnerability Detected</div>
                                            <div className="text-xs text-slate-500">Legacy SQL Injection Risk</div>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                        <div className="bg-red-500 h-full w-[85%]"></div>
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs text-slate-500">
                                        <span>Risk Level</span>
                                        <span className="text-red-500 font-bold">Critical</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Architect (Blueprint) */}
                            <div className={`feature-card p-10 flex flex-col h-full ${currentStep === 1 ? 'active' : ''}`} id="card-1">
                                <div className="absolute top-0 right-0 p-10">
                                    <Compass className="w-32 h-32 text-structura-blue opacity-10" />
                                </div>
                                <div className="bg-structura-black text-white p-6 rounded-xl shadow-xl w-3/4 mb-6 z-10 border border-slate-700">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                        <span className="font-mono text-xs text-slate-400">ARCHITECT_V2.0</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-structura-blue" /> Load Balancing</div>
                                        <div className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-structura-blue" /> Auto-Scaling Groups</div>
                                        <div className="flex items-center gap-2 text-sm"><Check className="w-4 h-4 text-structura-blue" /> Multi-AZ Failover</div>
                                    </div>
                                </div>
                                {/* Diagram lines */}
                                <div className="flex-1 relative">
                                    <div className="absolute top-0 left-8 w-0.5 h-full bg-slate-300 border-l border-dashed border-slate-400"></div>
                                    <div className="absolute top-1/2 left-8 w-16 h-0.5 bg-slate-300 border-t border-dashed border-slate-400"></div>
                                    <div className="absolute top-1/2 left-24 p-4 bg-white border border-structura-border rounded-lg shadow-sm">
                                        <Server className="w-6 h-6 text-structura-black" />
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Deploy (Rocket/Terminal) */}
                            <div className={`feature-card p-10 flex flex-col justify-center h-full bg-structura-black ${currentStep === 2 ? 'active' : ''}`} id="card-2">
                                <div className="font-mono text-xs text-green-400 mb-2">&gt; init_deployment_sequence.sh</div>
                                <div className="font-mono text-xs text-slate-400 mb-6">... checking dependencies ... OK</div>

                                <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-white text-sm font-bold">Build Progress</span>
                                        <span className="text-green-400 text-xs">98%</span>
                                    </div>
                                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                                        <div className="bg-green-500 h-full w-[98%] animate-pulse"></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-slate-800 p-3 rounded text-center">
                                        <GitCommit className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                                        <span className="text-[10px] text-slate-400">Commit</span>
                                    </div>
                                    <div className="bg-slate-800 p-3 rounded text-center">
                                        <TestTube className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
                                        <span className="text-[10px] text-slate-400">Test</span>
                                    </div>
                                    <div className="bg-slate-800 p-3 rounded text-center border border-green-500/50">
                                        <Rocket className="w-5 h-5 text-green-400 mx-auto mb-1" />
                                        <span className="text-[10px] text-white">Deploy</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 4: Optimize (Charts) */}
                            <div className={`feature-card p-10 flex flex-col h-full ${currentStep === 3 ? 'active' : ''}`} id="card-3">
                                <div className="flex justify-between items-center mb-8">
                                    <h5 className="font-bold text-structura-black">Performance Metrics</h5>
                                    <div className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">+24% Efficiency</div>
                                </div>

                                {/* Chart */}
                                <div className="flex items-end gap-2 h-32 mb-6">
                                    <div className="w-1/6 bg-structura-blue/20 h-[40%] rounded-t"></div>
                                    <div className="w-1/6 bg-structura-blue/30 h-[55%] rounded-t"></div>
                                    <div className="w-1/6 bg-structura-blue/40 h-[45%] rounded-t"></div>
                                    <div className="w-1/6 bg-structura-blue/60 h-[70%] rounded-t"></div>
                                    <div className="w-1/6 bg-structura-blue/80 h-[60%] rounded-t"></div>
                                    <div className="w-1/6 bg-structura-blue h-[90%] rounded-t relative group">
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-structura-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            Peak
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white border border-structura-border rounded-xl shadow-sm">
                                        <div className="text-xs text-slate-500 mb-1">Latency</div>
                                        <div className="text-xl font-bold text-structura-black">12ms <span className="text-xs text-green-500 font-normal">↓ 4ms</span></div>
                                    </div>
                                    <div className="p-4 bg-white border border-structura-border rounded-xl shadow-sm">
                                        <div className="text-xs text-slate-500 mb-1">Cost Savings</div>
                                        <div className="text-xl font-bold text-structura-black">$12k <span className="text-xs text-green-500 font-normal">/mo</span></div>
                                    </div>
                                </div>
                            </div>

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
