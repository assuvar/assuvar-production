'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Link } from '@/src/i18n/navigation';
import { insightsData } from './InsightsData';

// Helper to render icon by name
const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
    // @ts-ignore - Dynamic access to icons
    const IconComponent = LucideIcons[name];
    if (!IconComponent) return null;
    return <IconComponent className={className} />;
};

export default function InsightsDropdown() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="hidden md:block"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <div className="relative h-20 flex items-center cursor-pointer group">
                <span className={`transition-colors flex items-center gap-1 text-sm font-medium ${isOpen ? 'text-structura-black' : 'text-slate-600 hover:text-structura-black'}`}>
                    Insights <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </span>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-20 left-1/2 -translate-x-1/2 w-[340px] bg-white border border-slate-100 shadow-xl rounded-xl overflow-hidden cursor-default z-50 p-2"
                        >
                            <div className="grid grid-cols-1 gap-1">
                                {insightsData.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                        className="group flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 group-hover:text-white group-hover:bg-brand-gradient group-hover:border-transparent transition-all duration-300">
                                            <DynamicIcon name={item.icon} className="w-5 h-5 stroke-[1.5px]" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-structura-black group-hover:text-structura-blue transition-colors flex items-center gap-2">
                                                {item.label}
                                            </div>
                                            <div className="text-xs text-slate-500">{item.description}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
