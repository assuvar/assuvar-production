'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, BarChart, Code2, ExternalLink } from 'lucide-react';
import { Link } from '@/src/i18n/navigation';
import { successStoriesData } from '@/components/insights/SuccessStoriesData';

export default function SuccessStoryDetailsPage() {
    const params = useParams();
    const slug = params.slug;
    const story = successStoriesData.find(s => s.slug === slug) || successStoriesData[0]; // Fallback for demo

    return (
        <main className="pt-20 bg-white min-h-screen">
            {/* HERO */}
            <section className="relative py-24 bg-accent-gradient text-white overflow-hidden">
                <div className="absolute inset-0 z-0 bg-brand-gradient opacity-10"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <Link href="/insights/customer-success-stories" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> All Stories
                    </Link>

                    <div className="flex flex-col md:flex-row justify-between gap-12">
                        <div className="max-w-3xl">
                            <div className="inline-block px-3 py-1 rounded bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-wider mb-6">
                                {story.industry}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">{story.title}</h1>
                            <div className="text-xl text-slate-300">Client: {story.client}</div>
                        </div>
                        <div className="w-full md:w-auto bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm self-center">
                            <div className="flex items-center gap-3 mb-2">
                                <BarChart className="w-5 h-5 text-green-400" />
                                <span className="font-bold text-green-400 uppercase text-xs">Primary Outcome</span>
                            </div>
                            <div className="text-2xl font-bold">{story.result}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PROBLEM / SOLUTION / DETAILS */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* LEFT CONTENT */}
                    <div className="lg:col-span-2 space-y-16">
                        <div>
                            <h2 className="text-2xl font-bold text-structura-black mb-4 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-sm">01</span>
                                The Challenge
                            </h2>
                            <p className="text-slate-600 text-lg leading-relaxed">{story.problem}</p>
                            <p className="text-slate-600 mt-4">
                                The client faced significant scalability issues during peak hours, leading to revenue loss and customer churn. Legacy systems were rigidly coupled, making rapid iteration impossible.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-structura-black mb-4 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">02</span>
                                Our Solution
                            </h2>
                            <p className="text-slate-600 text-lg leading-relaxed">{story.solution}</p>
                            <ul className="mt-6 space-y-3">
                                <li className="flex items-center gap-3 text-slate-600">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" /> re-architected into microservices.
                                </li>
                                <li className="flex items-center gap-3 text-slate-600">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" /> Implemented automated CI/CD pipelines.
                                </li>
                                <li className="flex items-center gap-3 text-slate-600">
                                    <CheckCircle2 className="w-5 h-5 text-green-500" /> Real-time monitoring and alert systems.
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 sticky top-24">
                            <h3 className="text-lg font-bold text-structura-black mb-6">Tech Stack</h3>
                            <div className="flex flex-wrap gap-2 mb-8">
                                {story.technologies.map(tech => (
                                    <span key={tech} className="px-3 py-1 bg-white border border-slate-200 rounded-md text-sm text-slate-600 font-medium">
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            <h3 className="text-lg font-bold text-structura-black mb-4">Services Provided</h3>
                            <ul className="space-y-2 mb-8">
                                <li className="text-sm text-slate-600 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-structura-blue rounded-full"></div> Cloud Architecture</li>
                                <li className="text-sm text-slate-600 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-structura-blue rounded-full"></div> Backend Engineering</li>
                                <li className="text-sm text-slate-600 flex items-center gap-2"><div className="w-1.5 h-1.5 bg-structura-blue rounded-full"></div> Performance Tuning</li>
                            </ul>

                            <Link href="/contact" className="block w-full text-center py-3 bg-structura-black text-white rounded-lg font-bold hover:bg-slate-800 transition-colors">
                                Start Your Project
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
