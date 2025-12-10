'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ChevronDown, X, Menu, ArrowRight, Instagram, Linkedin, Facebook } from 'lucide-react';
import { Link } from '@/src/i18n/navigation';
import { servicesData } from './ServicesData';
import { productsData } from './ProductsData';

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

    const menuVariants: Variants = {
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
                            className="fixed inset-0 bg-white z-[9999] overflow-y-auto w-screen min-h-[100dvh]"
                        >
                            <div className="flex flex-col min-h-screen p-6 text-structura-black pb-20">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-10">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 bg-slate-100 rounded-full hover:bg-purple-50 hover:text-[#6A0DAD] transition-colors"
                                    >
                                        <X className="w-6 h-6 text-structura-black" />
                                    </button>
                                    <div className="text-sm font-medium text-slate-500">EN | India</div>
                                </div>

                                {/* Main Nav */}
                                <nav className="flex-grow space-y-6">
                                    {/* What we do (Accordion Wrapper) */}
                                    <div>
                                        <div className="text-2xl font-display font-bold mb-4 text-structura-black">What we do</div>
                                        <div className="space-y-4 pl-4 border-l-2 border-slate-100">
                                            {servicesData.map((category) => (
                                                <div key={category.id}>
                                                    <button
                                                        onClick={() => toggleCategory(category.id)}
                                                        className="w-full flex justify-between items-center py-2 text-lg font-bold text-slate-600 hover:text-[#6A0DAD] transition-colors"
                                                    >
                                                        {category.label}
                                                        <ChevronDown
                                                            className={`w-5 h-5 transition-transform duration-300 ${expandedCategory === category.id ? 'rotate-180 text-[#6A0DAD]' : 'text-slate-400'}`}
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
                                                                <div className="pl-4 py-2 space-y-3 border-l border-purple-100 ml-1">
                                                                    {category.services.map((service) => (
                                                                        <Link
                                                                            key={service.slug}
                                                                            href={`/services/${category.slug}/${service.slug}`}
                                                                            onClick={() => setIsOpen(false)}
                                                                            className="block text-sm font-medium text-slate-500 hover:text-[#6A0DAD] hover:translate-x-1 transition-all"
                                                                        >
                                                                            {service.label}
                                                                        </Link>
                                                                    ))}
                                                                    {/* Mobile link to category page */}
                                                                    <Link
                                                                        href={`/services/${category.slug}`}
                                                                        onClick={() => setIsOpen(false)}
                                                                        className="block mt-4 text-xs font-bold text-[#6A0DAD] uppercase tracking-wider flex items-center gap-1"
                                                                    >
                                                                        View All {category.label} <ArrowRight className="w-3 h-3" />
                                                                    </Link>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Products (Accordion Wrapper) */}
                                    <div>
                                        <button
                                            onClick={() => toggleCategory('products')}
                                            className="w-full flex justify-between items-center py-2 text-2xl font-display font-bold text-structura-black mb-2 hover:text-[#6A0DAD] transition-colors"
                                        >
                                            Products
                                            <ChevronDown
                                                className={`w-5 h-5 transition-transform duration-300 ${expandedCategory === 'products' ? 'rotate-180 text-[#6A0DAD]' : 'text-slate-400'}`}
                                            />
                                        </button>

                                        <AnimatePresence>
                                            {expandedCategory === 'products' && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pl-4 py-2 space-y-3 border-l-2 border-slate-100 ml-1">
                                                        {productsData.map((product) => (
                                                            <Link
                                                                key={product.slug}
                                                                href={`/products/${product.slug}`}
                                                                onClick={() => setIsOpen(false)}
                                                                className="flex items-center justify-between text-lg font-medium text-slate-500 hover:text-[#6A0DAD] hover:translate-x-1 transition-all"
                                                            >
                                                                {product.label}
                                                                {product.status === 'coming-soon' && (
                                                                    <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Soon</span>
                                                                )}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <Link href="#" className="block text-2xl font-display font-bold text-slate-400 hover:text-structura-black transition-colors">Solutions</Link>

                                    <Link href="#" className="block text-2xl font-display font-bold text-slate-400 hover:text-structura-black transition-colors">Insights</Link>
                                    <Link href="#" className="block text-2xl font-display font-bold text-slate-400 hover:text-structura-black transition-colors">About Us</Link>
                                </nav>

                                {/* Footer / Contact */}
                                <div className="pt-10 border-t border-slate-100 mt-10">
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <Link href="#" className="text-sm font-bold text-structura-black">Contact Us</Link>
                                        <Link href="#" className="text-sm font-semibold text-slate-500">Careers</Link>
                                        <Link href="#" className="text-sm font-semibold text-slate-500">Locations</Link>
                                    </div>

                                    <div className="flex gap-4">
                                        <a href="#" className="p-3 bg-slate-50 rounded-lg hover:bg-[#6A0DAD] hover:text-white text-structura-black transition-all shadow-sm border border-slate-100"><Linkedin className="w-5 h-5" /></a>
                                        <a href="#" className="p-3 bg-slate-50 rounded-lg hover:bg-[#6A0DAD] hover:text-white text-structura-black transition-all shadow-sm border border-slate-100"><Facebook className="w-5 h-5" /></a>
                                        <a href="#" className="p-3 bg-slate-50 rounded-lg hover:bg-[#6A0DAD] hover:text-white text-structura-black transition-all shadow-sm border border-slate-100"><Instagram className="w-5 h-5" /></a>
                                        <a href="#" className="p-3 bg-slate-50 rounded-lg hover:bg-[#6A0DAD] hover:text-white text-structura-black transition-all shadow-sm border border-slate-100">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
