'use client';

import { Link } from '@/src/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { FeaturedContent } from './ServicesData';

interface BlogCardProps {
    featured: FeaturedContent;
}

export default function BlogCard({ featured }: BlogCardProps) {
    return (
        <Link href={featured.link} className="block group">
            <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-100 transition-all duration-300 hover:shadow-md hover:border-purple-100 flex flex-col h-full">
                {/* Placeholder for optional thumbnail if needed, currently just text focus as requested for small card */}
                <div className="h-32 bg-slate-200 w-full relative overflow-hidden">
                    {/* In a real app, use next/image here */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                    <span className="text-[10px] font-bold tracking-wider text-[#6A0DAD] mb-2 uppercase">Featured Insight</span>
                    <h4 className="font-bold text-structura-black text-sm leading-snug mb-3 line-clamp-2 group-hover:text-[#6A0DAD] transition-colors">
                        {featured.title}
                    </h4>
                    <div className="mt-auto flex items-center text-xs font-semibold text-slate-500 group-hover:text-[#6A0DAD] transition-colors">
                        Read more <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
