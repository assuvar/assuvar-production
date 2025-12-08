'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, Menu, ArrowRight } from 'lucide-react';
import { Link } from '@/src/i18n/navigation';
import { servicesData } from './ServicesData';
import BlogCard from './BlogCard';

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    const toggleCategory = (id: string) => {
        setExpandedCategory(expandedCategory === id ? null : id);
    };

    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-structura-black hover:text-[#6A0DAD] transition-colors"
                aria-label="Open menu"
            >
                <Menu className="w-6 h-6" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-[85vw] max-w-sm bg-white z-50 shadow-2xl overflow-y-auto"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-8">
                                    <span className="text-xl font-display font-bold text-structura-black">Services</span>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 text-slate-400 hover:text-structura-black transition-colors"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {servicesData.map((category) => (
                                        <div key={category.id} className="border-b border-slate-100 last:border-0 pb-2">
                                            <button
                                                onClick={() => toggleCategory(category.id)}
                                                className="w-full flex justify-between items-center py-3 text-left font-bold text-structura-black hover:text-[#6A0DAD] transition-colors"
                                            >
                                                {category.title}
                                                <ChevronDown
                                                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${expandedCategory === category.id ? 'rotate-180' : ''}`}
                                                />
                                            </button>

                                            <AnimatePresence>
                                                {expandedCategory === category.id && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="pl-4 pb-4 pt-1 space-y-2">
                                                            {category.services.map((service) => (
                                                                <Link
                                                                    key={service.slug}
                                                                    href={`/services/${category.slug}/${service.slug}`}
                                                                    className="block py-2 text-sm text-slate-600 hover:text-[#6A0DAD] transition-colors"
                                                                    onClick={() => setIsOpen(false)}
                                                                >
                                                                    {service.title}
                                                                </Link>
                                                            ))}

                                                            <div className="mt-4 pt-4 border-t border-slate-50">
                                                                <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Featured</p>
                                                                <Link
                                                                    href={category.featured.link}
                                                                    className="text-sm font-medium text-structura-black hover:text-[#6A0DAD] flex items-center gap-1"
                                                                    onClick={() => setIsOpen(false)}
                                                                >
                                                                    {category.featured.title} <ArrowRight className="w-3 h-3" />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
