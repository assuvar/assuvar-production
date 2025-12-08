'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, Menu, ArrowRight, Instagram, Linkedin, Facebook } from 'lucide-react';
import { Link } from '@/src/i18n/navigation';
import { servicesData } from './ServicesData';

export default function MobileFullScreenMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const toggleCategory = (id: string) => {
        setExpandedCategory(expandedCategory === id ? null : id);
    };

    const menuVariants = {
        closed: {
            opacity: 0,
            y: "-100%",
            transition: { duration: 0.3, ease: 'easeInOut' }
        },
        open: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3, ease: 'easeInOut' }
        }
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

            {mounted && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={menuVariants}
                            className="fixed inset-0 bg-slate-900 z-[9999] overflow-y-auto w-screen min-h-[100dvh]"
                        >
                            <div className="flex flex-col min-h-screen p-6 text-white pb-20">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-10">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                                    >
                                        <X className="w-6 h-6 text-white" />
                                    </button>
                                    <div className="text-sm font-medium text-slate-400">EN | India</div>
                                </div>

                                {/* Main Nav */}
                                <nav className="flex-grow space-y-6">
                                    {/* What we do (Accordion Wrapper) */}
                                    <div>
                                        <div className="text-2xl font-bold mb-4 text-white">What we do</div>
                                        <div className="space-y-4 pl-4 border-l border-slate-700">
                                            {servicesData.map((category) => (
                                                <div key={category.id}>
                                                    <button
                                                        onClick={() => toggleCategory(category.id)}
                                                        className="w-full flex justify-between items-center py-2 text-lg font-medium text-slate-300 hover:text-white transition-colors"
                                                    >
                                                        {category.label}
                                                        <ChevronDown
                                                            className={`w-5 h-5 transition-transform duration-300 ${expandedCategory === category.id ? 'rotate-180 text-[#6A0DAD]' : 'text-slate-500'}`}
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
                                                                <div className="pl-4 py-2 space-y-3">
                                                                    {category.services.map((service) => (
                                                                        <Link
                                                                            key={service.slug}
                                                                            href={`/services/${category.slug}/${service.slug}`}
                                                                            onClick={() => setIsOpen(false)}
                                                                            className="block text-sm text-slate-400 hover:text-[#6A0DAD] transition-colors"
                                                                        >
                                                                            {service.label}
                                                                        </Link>
                                                                    ))}
                                                                    {/* Mobile link to category page */}
                                                                    <Link
                                                                        href={`/services/${category.slug}`}
                                                                        onClick={() => setIsOpen(false)}
                                                                        className="block mt-2 text-xs font-bold text-[#6A0DAD] uppercase tracking-wider"
                                                                    >
                                                                        View All {category.label} &rarr;
                                                                    </Link>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Link href="#" className="block text-2xl font-bold text-slate-300 hover:text-white transition-colors">Solutions</Link>
                                    <Link href="#" className="block text-2xl font-bold text-slate-300 hover:text-white transition-colors">Enterprise</Link>
                                    <Link href="#" className="block text-2xl font-bold text-slate-300 hover:text-white transition-colors">Insights</Link>
                                    <Link href="#" className="block text-2xl font-bold text-slate-300 hover:text-white transition-colors">About Us</Link>
                                </nav>

                                {/* Footer / Contact */}
                                <div className="pt-10 border-t border-slate-800 mt-10">
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <Link href="#" className="text-sm font-semibold text-white">Contact Us</Link>
                                        <Link href="#" className="text-sm font-semibold text-slate-400">Careers</Link>
                                        <Link href="#" className="text-sm font-semibold text-slate-400">Locations</Link>
                                    </div>

                                    <div className="flex gap-6">
                                        <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-[#6A0DAD] transition-colors"><Linkedin className="w-5 h-5 text-white" /></a>
                                        <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-[#6A0DAD] transition-colors"><Facebook className="w-5 h-5 text-white" /></a>
                                        <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-[#6A0DAD] transition-colors"><Instagram className="w-5 h-5 text-white" /></a>
                                        <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-[#6A0DAD] transition-colors">
                                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}
