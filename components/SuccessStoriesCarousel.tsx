'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import { Link } from '@/src/i18n/navigation';
import { ArrowRight, Trophy, Play } from 'lucide-react';
import { successStoriesData } from '@/components/insights/SuccessStoriesData';

// Duplicate data for seamless loop
const repeatedData = [...successStoriesData, ...successStoriesData];

export default function SuccessStoriesCarousel() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full relative pt-[100px] pb-[120px] overflow-hidden"
        >
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[500px] bg-structura-blue/5 blur-3xl rounded-full -z-10 opacity-30 pointer-events-none"></div>

            <div className="text-center mb-[80px] px-6">
                <h2 className="text-3xl md:text-5xl font-bold font-display text-structura-black mb-[30px]">Customer Success Stories</h2>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light">
                    Real results from businesses we’ve helped transform.
                </p>
            </div>

            <div
                className="w-full"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="flex gap-8 w-max">
                    <motion.div
                        className="flex gap-8"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 50,
                            repeatType: "loop"
                        }}
                        style={{ animationPlayState: isHovered ? 'paused' : 'running' }}
                    >
                        {repeatedData.map((story, i) => (
                            <Card key={`row1-${story.id}-${i}`} story={story} />
                        ))}
                    </motion.div>
                </div>
            </div>

            <div className="flex justify-center mt-[100px]">
                <Link
                    href="/insights/customer-success-stories"
                    className="btn-fusion px-8 py-4 rounded-full text-sm font-bold shadow-lg shadow-structura-blue/20 flex items-center gap-2 hover:scale-105 transition-transform"
                >
                    View All Success Stories <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </motion.div>
    );
}

function Card({ story }: { story: any }) {
    return (
        <motion.div
            whileHover={{ y: -8, boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            className="min-w-[350px] md:min-w-[420px] h-[500px] bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col relative overflow-hidden group select-none transition-all duration-300"
        >
            {/* Image/GIF Area */}
            <div className="h-[260px] bg-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 group-hover:scale-105 transition-transform duration-700 ease-out">
                    {story.gifUrl && (
                        /* Placeholder logic for GIF - if it existed it would go here. 
                           For now keeping the clean placeholder style.
                        */
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-structura-blue/5" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                        <Play className="w-12 h-12 opacity-50 fill-current" />
                    </div>
                </div>
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>

                <div className="absolute bottom-6 left-6 right-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-bold text-white uppercase tracking-wider mb-3">
                        {story.industry}
                    </span>
                    <h3 className="text-2xl font-bold text-white leading-tight drop-shadow-lg">
                        {story.title}
                    </h3>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 flex flex-col justify-between bg-white relative">
                {/* Border Gradient Accent on Hover */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-structura-blue/20 transition-colors pointer-events-none"></div>

                <div>
                    <div className="mb-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">The Challenge</h4>
                        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                            {story.problem}
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-structura-blue uppercase tracking-wider mb-2">Outcome</h4>
                        <p className="text-lg font-bold text-structura-black leading-tight">
                            {story.result}
                        </p>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between z-10">
                    <div className="flex gap-2">
                        {story.technologies.slice(0, 3).map((tech: string) => (
                            <span key={tech} className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
