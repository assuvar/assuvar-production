'use client';

import { motion } from 'framer-motion';

export default function AmbientWave({ className = "", opacity = 0.5 }: { className?: string, opacity?: number }) {
    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} style={{ zIndex: 0 }}>
            <motion.svg
                className="absolute w-full h-full"
                viewBox="0 0 1440 800"
                preserveAspectRatio="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: opacity }}
                transition={{ duration: 2 }}
            >
                {/* Wave 1 - Purple/Blue Gradient */}
                <motion.path
                    d="M-100,400 C300,350 500,550 900,450 C1300,350 1500,450 1600,500 L1600,1000 L-100,1000 Z"
                    fill="url(#wave-gradient-1)"
                    animate={{
                        d: [
                            "M-100,400 C300,350 500,550 900,450 C1300,350 1500,450 1600,500 L1600,1000 L-100,1000 Z",
                            "M-100,420 C350,380 550,520 950,480 C1350,380 1550,420 1600,520 L1600,1000 L-100,1000 Z",
                            "M-100,400 C300,350 500,550 900,450 C1300,350 1500,450 1600,500 L1600,1000 L-100,1000 Z"
                        ]
                    }}
                    transition={{
                        duration: 15,
                        ease: "easeInOut",
                        repeat: Infinity
                    }}
                    className="opacity-40"
                />

                {/* Wave 2 - Abstract AI Signal Line */}
                <motion.path
                    d="M-100,600 C300,550 600,650 1000,550 C1400,450 1600,600 1700,650"
                    stroke="url(#wave-stroke-1)"
                    strokeWidth="2"
                    fill="none"
                    animate={{
                        d: [
                            "M-100,600 C300,550 600,650 1000,550 C1400,450 1600,600 1700,650",
                            "M-100,620 C250,580 650,620 1050,580 C1350,480 1550,580 1700,630",
                            "M-100,600 C300,550 600,650 1000,550 C1400,450 1600,600 1700,650"
                        ]
                    }}
                    transition={{
                        duration: 20,
                        ease: "easeInOut",
                        repeat: Infinity
                    }}
                    className="opacity-30"
                />

                <defs>
                    <linearGradient id="wave-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6767FD" stopOpacity="0.1" />
                        <stop offset="50%" stopColor="#A855F7" stopOpacity="0.05" />
                        <stop offset="100%" stopColor="#6767FD" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="wave-stroke-1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6767FD" stopOpacity="0" />
                        <stop offset="50%" stopColor="#A855F7" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#6767FD" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </motion.svg>
        </div >
    );
}
