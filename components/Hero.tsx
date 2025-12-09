'use client';

import { ArrowRight, Lock, ShieldCheck, Cpu, Database, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';
import AmbientWave from "@/components/AmbientWave";

export default function Hero() {
    const t = useTranslations('Hero');

    return (
        <main className="pt-32 pb-24 relative overflow-hidden">
            <AmbientWave className="opacity-60" />
            <div className="absolute inset-0 bg-grid-pattern wire-bg -z-20 opacity-60 pointer-events-none"></div>
            <div className="absolute inset-0 bg-blueprint-glow -z-10 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-structura-border shadow-sm text-xs font-semibold text-structura-blue mb-8 uppercase tracking-wider">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-structura-blue opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-structura-blue"></span>
                    </span>
                    {t('systemStatus')}
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] text-structura-black">
                    {t('title')} <br />
                    <span className="text-gradient">{t('subtitle')}</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                    {t('description')}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
                    <button className="btn-fusion px-8 py-4 rounded-xl text-base font-semibold w-full sm:w-auto shadow-xl shadow-structura-blue/20">
                        {t('initializeBtn')}
                    </button>
                    <button className="btn-secondary px-8 py-4 rounded-xl text-slate-700 font-semibold w-full sm:w-auto flex items-center justify-center gap-2 group">
                        {t('viewTechStackBtn')}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Hero Graphic */}
                <div className="relative max-w-6xl mx-auto">
                    <div className="absolute -inset-4 bg-gradient-to-r from-structura-blue/5 to-purple-500/5 rounded-3xl blur-2xl -z-10"></div>
                    <div className="bg-structura-surface rounded-2xl border border-structura-border shadow-2xl overflow-hidden relative z-0">
                        <div className="h-12 bg-slate-50 border-b border-structura-border flex items-center px-4 justify-between" dir="ltr">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                            </div>
                            <div className="px-4 py-1 bg-white border border-structura-border rounded text-[10px] font-mono text-slate-400 flex items-center gap-2">
                                <Lock className="w-3 h-3" /> structura_os_kernel.sys
                            </div>
                            <div className="w-16"></div>
                        </div>

                        <div className="p-0 grid grid-cols-12 h-[560px] bg-slate-50/30">
                            <div className="col-span-12 md:col-span-3 border-r border-structura-border bg-white p-4 space-y-4 hidden md:block">
                                <div className="p-4 rounded-xl border border-structura-border bg-slate-50">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-xs font-mono text-slate-500">{t('loadBalancer')}</span>
                                        <span className="text-structura-blue font-bold">42%</span>
                                    </div>
                                    <div className="flex gap-1 h-8 items-end">
                                        <div className="w-1/6 bg-structura-blue/20 h-[30%] rounded-sm"></div>
                                        <div className="w-1/6 bg-structura-blue/40 h-[50%] rounded-sm"></div>
                                        <div className="w-1/6 bg-structura-blue/60 h-[70%] rounded-sm"></div>
                                        <div className="w-1/6 bg-structura-blue h-[42%] rounded-sm relative">
                                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                                        </div>
                                        <div className="w-1/6 bg-structura-border h-[20%] rounded-sm"></div>
                                        <div className="w-1/6 bg-structura-border h-[25%] rounded-sm"></div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl border border-structura-border bg-slate-50">
                                    <span className="text-xs font-mono text-slate-500 block mb-2">{t('threatVector')}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center">
                                            <ShieldCheck className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-structura-black">{t('secured')}</div>
                                            <div className="text-[10px] text-slate-400">{t('intrusions')}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl border border-structura-border bg-slate-50">
                                    <span className="text-xs font-mono text-slate-500 block mb-2">{t('nodeStatus')}</span>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[11px]">
                                            <span className="text-slate-600">US-EAST-1</span>
                                            <span className="text-green-600 font-mono">OK</span>
                                        </div>
                                        <div className="flex justify-between text-[11px]">
                                            <span className="text-slate-600">EU-WEST-2</span>
                                            <span className="text-green-600 font-mono">OK</span>
                                        </div>
                                        <div className="flex justify-between text-[11px]">
                                            <span className="text-slate-600">AP-SOUTH-1</span>
                                            <span className="text-green-600 font-mono">OK</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-12 md:col-span-9 relative overflow-hidden bg-slate-50/50">
                                <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
                                <div className="absolute top-6 left-6 z-10">
                                    <h3 className="font-display font-bold text-lg text-structura-black">{t('liveTopology')}</h3>
                                    <p className="text-xs text-slate-500">{t('realTimeMapping')}</p>
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center" dir="ltr">
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                                        <defs>
                                            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" style={{ stopColor: '#e2e8f0', stopOpacity: 1 }} />
                                                <stop offset="50%" style={{ stopColor: '#6767FD', stopOpacity: 1 }} />
                                                <stop offset="100%" style={{ stopColor: '#e2e8f0', stopOpacity: 1 }} />
                                            </linearGradient>
                                        </defs>
                                        <path d="M200,280 Q400,100 600,280" stroke="url(#lineGrad)" strokeWidth="2" fill="none" className="opacity-40" />
                                        <path d="M200,280 Q400,460 600,280" stroke="#e2e8f0" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                                    </svg>
                                    <div className="relative z-10 animate-float">
                                        <div className="w-24 h-24 bg-white border-4 border-structura-light rounded-full shadow-xl flex items-center justify-center relative">
                                            <div className="absolute inset-0 rounded-full border border-structura-blue animate-pulse-slow"></div>
                                            <div className="text-center">
                                                <Cpu className="w-8 h-8 text-structura-black mx-auto mb-1" />
                                                <div className="text-[10px] font-bold text-structura-blue">{t('core')}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute left-[15%] top-1/2 -translate-y-1/2 animate-float" style={{ animationDelay: '1s' }}>
                                        <div className="w-16 h-16 bg-white border border-structura-border rounded-xl shadow-lg flex flex-col items-center justify-center">
                                            <Database className="w-6 h-6 text-slate-400" />
                                            <span className="text-[9px] font-mono mt-1 text-slate-500">DB_01</span>
                                        </div>
                                    </div>
                                    <div className="absolute right-[15%] top-1/2 -translate-y-1/2 animate-float" style={{ animationDelay: '2s' }}>
                                        <div className="w-16 h-16 bg-structura-black border border-structura-black rounded-xl shadow-lg flex flex-col items-center justify-center text-white">
                                            <Globe className="w-6 h-6" />
                                            <span className="text-[9px] font-mono mt-1 opacity-70">{t('cdn')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
