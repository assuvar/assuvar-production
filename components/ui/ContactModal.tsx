'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useContactModal } from '@/context/ContactModalContext';
import GlobalContactForm from '@/components/GlobalContactForm';

export default function ContactModal() {
    const { isOpen, closeContactModal, mode } = useContactModal();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* BACKDROP */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeContactModal}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]"
                    />

                    {/* MODAL CONTENT */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-[10000] p-4"
                    >
                        <div className="relative">
                            <button
                                onClick={closeContactModal}
                                className="absolute right-4 top-4 z-50 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                            <GlobalContactForm mode={mode} className="border-0 shadow-2xl" />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
