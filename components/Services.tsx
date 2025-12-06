import Link from 'next/link';
import { Cloud, ArrowRight, Shield, Network, Terminal, FileCheck, ArrowUpRight } from 'lucide-react';

export default function Services() {
    return (
        <section className="py-32 max-w-7xl mx-auto px-6">
            <div className="mb-20 max-w-3xl">
                <h2 className="text-sm font-bold text-structura-blue uppercase tracking-wider mb-4">Core Capabilities</h2>
                <h3 className="text-4xl md:text-5xl font-bold font-display text-structura-black mb-6">Engineered for the Scale of Tomorrow.</h3>
                <p className="text-slate-500 text-xl leading-relaxed">
                    We don&apos;t just fix computers. We architect resilient systems that serve as the foundation for your enterprise operations.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="col-span-1 md:col-span-2 md:row-span-2 card-enterprise p-10 rounded-3xl flex flex-col justify-between">
                    <div>
                        <div className="w-14 h-14 bg-structura-light border border-structura-border rounded-xl flex items-center justify-center mb-8">
                            <Cloud className="w-7 h-7 text-structura-blue" />
                        </div>
                        <h4 className="text-2xl font-bold font-display mb-4">Cloud Architecture</h4>
                        <p className="text-slate-500 leading-relaxed text-lg">
                            Scalable, secure cloud environments on AWS and Azure. We handle migration, optimization, and multi-cloud management strategies.
                        </p>
                    </div>
                    <div className="mt-8">
                        <Link href="#" className="text-structura-black font-semibold flex items-center hover:text-structura-blue transition-colors">
                            Explore Cloud Solutions <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </div>
                </div>
                <div className="col-span-1 md:col-span-2 card-enterprise p-8 rounded-3xl flex items-center gap-6">
                    <div className="w-14 h-14 bg-structura-black text-white rounded-xl flex items-center justify-center flex-shrink-0">
                        <Shield className="w-7 h-7" />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold font-display mb-2">Cybersecurity Fortress</h4>
                        <p className="text-slate-500 text-sm">Enterprise-grade threat detection & Zero Trust architecture.</p>
                    </div>
                </div>
                <div className="col-span-1 card-enterprise p-8 rounded-3xl">
                    <div className="w-12 h-12 bg-structura-light border border-structura-border rounded-xl flex items-center justify-center mb-6">
                        <Network className="w-6 h-6 text-structura-black" />
                    </div>
                    <h4 className="text-lg font-bold font-display mb-2">Network Infra</h4>
                    <p className="text-slate-500 text-sm mb-4">SD-WAN, Fiber optics, and high-availability routing.</p>
                </div>
                <div className="col-span-1 card-enterprise p-8 rounded-3xl">
                    <div className="w-12 h-12 bg-structura-light border border-structura-border rounded-xl flex items-center justify-center mb-6">
                        <Terminal className="w-6 h-6 text-structura-black" />
                    </div>
                    <h4 className="text-lg font-bold font-display mb-2">DevOps Ops</h4>
                    <p className="text-slate-500 text-sm mb-4">CI/CD pipelines automating software delivery.</p>
                </div>
                <div className="col-span-1 md:col-span-2 card-enterprise p-8 rounded-3xl bg-structura-black text-white border-structura-black group">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                                <FileCheck className="w-6 h-6 text-white" />
                            </div>
                            <h4 className="text-xl font-bold font-display mb-2">Data Compliance</h4>
                            <p className="text-slate-400 text-sm max-w-xs">GDPR, HIPAA, and SOC2 readiness audits built-in.</p>
                        </div>
                        <div className="hidden md:block">
                            <ArrowUpRight className="w-6 h-6 text-white opacity-50 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                </div>
                <div className="col-span-1 md:col-span-2 card-enterprise p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1">
                        <h4 className="text-xl font-bold font-display mb-2">Edge Computing</h4>
                        <p className="text-slate-500 text-sm">Processing power distributed to the source of data generation.</p>
                    </div>
                    <div className="w-full md:w-1/3 h-16 bg-slate-100 rounded-lg relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-full h-full flex items-end px-2 pb-2 gap-1">
                            <div className="w-1/5 h-[40%] bg-structura-blue/40 rounded-sm"></div>
                            <div className="w-1/5 h-[70%] bg-structura-blue/60 rounded-sm"></div>
                            <div className="w-1/5 h-[50%] bg-structura-blue/40 rounded-sm"></div>
                            <div className="w-1/5 h-[90%] bg-structura-blue rounded-sm"></div>
                            <div className="w-1/5 h-[60%] bg-structura-blue/50 rounded-sm"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
