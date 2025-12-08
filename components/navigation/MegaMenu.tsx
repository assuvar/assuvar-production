'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from '@/src/i18n/navigation';
import { servicesData } from './ServicesData';
import BlogCard from './BlogCard';

export default function MegaMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeCategoryId, setActiveCategoryId] = useState(servicesData[0].id);

    const activeCategory = servicesData.find(c => c.id === activeCategoryId) || servicesData[0];

    return (
        <div
            className="hidden md:block"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <div className="relative h-20 flex items-center cursor-pointer group">
                <span className={`transition-colors flex items-center gap-1 text-sm font-medium ${isOpen ? 'text-structura-black' : 'text-slate-600 hover:text-structura-black'}`}>
                    Services <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </span>

                {/* Mega Menu Container */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] lg:w-[900px] bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden cursor-default z-50"
                        >
                            <div className="flex min-h-[400px]">
                                {/* Left Column: Categories */}
                                <div className="w-64 bg-slate-50 border-r border-slate-100 p-6 flex flex-col">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Categories</h3>
                                    <div className="space-y-1 flex-grow">
                                        {servicesData.map((category) => (
                                            <div
                                                key={category.id}
                                                onMouseEnter={() => setActiveCategoryId(category.id)}
                                                className={`
                          px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-between group/item
                          ${activeCategoryId === category.id
                                                        ? 'bg-white shadow-sm text-[#6A0DAD] font-bold ring-1 ring-purple-100'
                                                        : 'text-slate-600 hover:bg-slate-200/50 hover:text-structura-black'}
                        `}
                                            >
                                                {category.title}
                                                {activeCategoryId === category.id && (
                                                    <motion.div layoutId="activeIndicator" className="w-1.5 h-1.5 rounded-full bg-[#6A0DAD]" />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Bottom Left Card */}
                                    <div className="mt-6">
                                        <BlogCard featured={activeCategory.featured} />
                                    </div>
                                </div>

                                {/* Right Column: Services */}
                                <div className="flex-1 p-8 bg-white">
                                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-50">
                                        <h4 className="text-xl font-display font-bold text-structura-black">{activeCategory.title}</h4>
                                        <Link
                                            href={`/services/${activeCategory.slug}`}
                                            className="text-xs font-bold text-[#6A0DAD] hover:underline flex items-center gap-1"
                                        >
                                            View Category <ArrowRight className="w-3 h-3" />
                                        </Link>
                                    </div>

                                    <motion.div
                                        key={activeCategoryId}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="grid grid-cols-2 gap-x-8 gap-y-3"
                                    >
                                        {activeCategory.services.map((service) => (
                                            <Link
                                                key={service.slug}
                                                href={`/services/${activeCategory.slug}/${service.slug}`}
                                                className="group/link flex items-center justify-between py-2 px-3 -mx-3 rounded-lg hover:bg-slate-50 transition-colors"
                                            >
                                                <span className="text-sm text-slate-600 font-medium group-hover/link:text-structura-black transition-colors">
                                                    {service.title}
                                                </span>
                                                <ArrowRight className="w-3 h-3 text-slate-300 opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all duration-200" />
                                            </Link>
                                        ))}
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
