'use client';

import { ArrowRight, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import AmbientWave from "@/components/AmbientWave";
import { Link } from '@/src/i18n/navigation';

const SuccessStoriesCarousel = dynamic(() => import('./SuccessStoriesCarousel'), { ssr: false });

export default function Hero() {
    const t = useTranslations('Hero');
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <main className="pt-32 pb-0 relative overflow-hidden">
            <AmbientWave className="opacity-40" />
            <div className="absolute inset-0 bg-grid-pattern wire-bg -z-20 opacity-30 pointer-events-none"></div>
            <div className="absolute inset-0 bg-blueprint-glow -z-10 pointer-events-none"></div>

            <motion.div
                style={{ y: y1, opacity }}
                className="max-w-7xl mx-auto px-6 text-center relative z-10 mb-12"
            >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 shadow-sm text-xs font-semibold text-white mb-8">
                    <Check className="w-3 h-3 text-green-400" />
                    Delivering Reliable IT & Digital Services Every Day
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] text-structura-black max-w-4xl mx-auto">
                    Building Reliable Digital Solutions for <br className="hidden md:block" />
                    <span className="text-structura-black">Modern Businesses</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                    We help businesses build, scale, and optimize digital systems with reliable engineering, automation, and intelligence-driven solutions tailored for impact.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <Link
                        href="#services"
                        className="btn-fusion px-8 py-4 rounded-xl text-base font-semibold w-full sm:w-auto shadow-xl shadow-structura-blue/20 flex items-center justify-center"
                    >
                        Explore Our Services
                    </Link>
                    <Link
                        href="/contact"
                        className="px-8 py-4 rounded-xl text-structura-black border border-slate-200 bg-white hover:bg-slate-50 font-semibold w-full sm:w-auto flex items-center justify-center gap-2 group transition-all"
                    >
                        Get Consultation
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </motion.div>

            {/* Success Stories Carousel (Replacing Topology) */}
            <SuccessStoriesCarousel />
        </main>
    );
}
