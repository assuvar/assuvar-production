import Link from 'next/link';
import { FileText, Shield, Cpu } from 'lucide-react';

export default function Insights() {
    return (
        <section className="py-24 max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-3xl font-bold font-display text-structura-black">Engineering Insights</h2>
                    <p className="text-slate-500 mt-2">Technical strategies for the modern CTO.</p>
                </div>
                <Link href="#" className="text-sm font-bold text-structura-black border-b border-structura-black pb-1 hover:text-structura-blue hover:border-structura-blue transition-colors">View All Articles</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <article className="group cursor-pointer">
                    <div className="bg-white border border-structura-border rounded-xl p-1 mb-4 overflow-hidden">
                        <div className="h-48 bg-slate-100 rounded-lg relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                            <div className="absolute inset-0 bg-grid-pattern opacity-50"></div>
                            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-structura-blue/10 to-transparent"></div>
                            <div className="absolute top-4 right-4 p-2 bg-white rounded-md shadow-sm">
                                <FileText className="w-4 h-4 text-structura-black" />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 text-xs font-bold text-structura-blue mb-2 uppercase">
                        <span>Architecture</span> • <span>5 min read</span>
                    </div>
                    <h3 className="text-xl font-bold font-display text-structura-black mb-2 group-hover:text-structura-blue transition-colors">Migrating Legacy Monoliths to Microservices</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">A strategic roadmap for de-risking your digital transformation without pausing business.</p>
                </article>

                <article className="group cursor-pointer">
                    <div className="bg-white border border-structura-border rounded-xl p-1 mb-4 overflow-hidden">
                        <div className="h-48 bg-slate-100 rounded-lg relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                            <div className="absolute inset-0 bg-grid-pattern opacity-50"></div>
                            <div className="absolute bottom-0 right-0 w-24 h-24 bg-structura-amber/10 rounded-full blur-xl"></div>
                            <div className="absolute top-4 right-4 p-2 bg-white rounded-md shadow-sm">
                                <Shield className="w-4 h-4 text-structura-black" />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 text-xs font-bold text-structura-blue mb-2 uppercase">
                        <span>Security</span> • <span>7 min read</span>
                    </div>
                    <h3 className="text-xl font-bold font-display text-structura-black mb-2 group-hover:text-structura-blue transition-colors">Zero Trust: Beyond the Buzzword</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">Implementing actual identity-aware proxies and context-based access controls.</p>
                </article>

                <article className="group cursor-pointer">
                    <div className="bg-white border border-structura-border rounded-xl p-1 mb-4 overflow-hidden">
                        <div className="h-48 bg-slate-100 rounded-lg relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                            <div className="absolute inset-0 bg-grid-pattern opacity-50"></div>
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-200 via-transparent to-transparent"></div>
                            <div className="absolute top-4 right-4 p-2 bg-white rounded-md shadow-sm">
                                <Cpu className="w-4 h-4 text-structura-black" />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 text-xs font-bold text-structura-blue mb-2 uppercase">
                        <span>Infrastructure</span> • <span>4 min read</span>
                    </div>
                    <h3 className="text-xl font-bold font-display text-structura-black mb-2 group-hover:text-structura-blue transition-colors">The Cost of Cloud Wastage</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">How to identify idle resources and implement automated cost-control governance.</p>
                </article>
            </div>
        </section>
    );
}
