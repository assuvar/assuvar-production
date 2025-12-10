'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy, BarChart, Code2 } from 'lucide-react';
import { Link } from '@/src/i18n/navigation';
import { successStoriesData } from '@/components/insights/SuccessStoriesData';

export default function SuccessStoriesPage() {
    const [filter, setFilter] = useState("All");
    const industries = ["All", ...Array.from(new Set(successStoriesData.map(s => s.industry)))];

    const filteredStories = filter === "All"
        ? successStoriesData
        : successStoriesData.filter(s => s.industry === filter);

    return (
        <main className="pt-20 bg-white min-h-screen">
            {/* HERO */}
            <section className="relative py-24 bg-white overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-5 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-structura-blue via-transparent to-transparent"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 text-sm font-bold text-structura-blue mb-6"
                    >
                        <Trophy className="w-4 h-4" /> Client Wins
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-display font-bold text-structura-black mb-6"
                    >
                        Customer <span className="text-structura-black">Success Stories</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed"
                    >
                        Real results. Tangible impact. See how we deliver value.
                    </motion.p>
                </div>
            </section>

            {/* FILTERS */}
            <section className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4">
                <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-3">
                    {industries.map((ind) => (
                        <button
                            key={ind}
                            onClick={() => setFilter(ind)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === ind
                                ? 'bg-structura-black text-white shadow-md'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {ind}
                        </button>
                    ))}
                </div>
            </section>

            {/* STORIES GRID */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {filteredStories.map((story, idx) => (
                            <motion.div
                                key={story.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-2xl p-8 border border-slate-100 hover:shadow-xl hover:shadow-structura-blue/5 transition-all duration-300 group"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="bg-slate-50 border border-slate-100 px-3 py-1 rounded-md text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        {story.industry}
                                    </div>
                                    <h3 className="text-lg font-bold text-structura-black">{story.client}</h3>
                                </div>

                                <h2 className="text-2xl font-bold text-structura-black mb-6 group-hover:text-structura-blue transition-colors">
                                    {story.title}
                                </h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex gap-3">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                                            <span className="text-xs font-bold">P</span>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Problem</span>
                                            <p className="text-slate-600 text-sm">{story.problem}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                            <span className="text-xs font-bold">S</span>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Solution</span>
                                            <p className="text-slate-600 text-sm">{story.solution}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="mt-1 w-6 h-6 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                                            <BarChart className="w-3 h-3" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Result</span>
                                            <p className="text-slate-700 font-bold text-sm">{story.result}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-6 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Code2 className="w-3 h-3" />
                                        {story.technologies.slice(0, 3).join(", ")}...
                                    </div>
                                    <Link href={`/insights/customer-success-stories/${story.slug}`} className="text-sm font-bold text-structura-black flex items-center gap-1 group-hover:gap-2 transition-all">
                                        Read Case Study <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
