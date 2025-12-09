'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Github, Twitter, Linkedin } from 'lucide-react';
import AmbientWave from "@/components/AmbientWave";

export default function Footer() {
    return (
        <footer className="bg-structura-black text-white pt-24 pb-12 relative overflow-hidden">
            <AmbientWave className="opacity-30 rotate-180" />

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-10 mb-16 relative z-10">
                <div className="col-span-2">
                    <Link href="#" className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 flex items-center justify-center rounded-md">
                            <Image
                                src="/assets/logo.svg"
                                alt="Structura IT Logo"
                                width={32}
                                height={32}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <span className="sr-only">Assuvar</span>
                        <Image
                            src="/assets/assuvar-wordmark.svg"
                            alt="Assuvar"
                            width={173}
                            height={30}
                            className="h-5 w-auto brightness-0 invert"
                        />
                    </Link>
                    <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
                        Building the digital foundations for tomorrow&apos;s enterprises. <br /> Robust. Secure. Scalable.
                    </p>
                    <div className="mt-8 pt-8 border-t border-white/10">
                        <h5 className="text-xs font-bold text-slate-500 mb-4 uppercase">Our Evolution</h5>
                        <div className="flex gap-4 text-xs font-mono text-slate-400">
                            <div>
                                <span className="block font-bold text-white">2015</span>
                                Founded
                            </div>
                            <div className="w-px bg-white/20"></div>
                            <div>
                                <span className="block font-bold text-white">2019</span>
                                Series B
                            </div>
                            <div className="w-px bg-white/20"></div>
                            <div>
                                <span className="block font-bold text-white">2024</span>
                                Global
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-6">Capabilities</h4>
                    <ul className="space-y-4 text-sm text-slate-400">
                        <li><Link href="#" className="hover:text-structura-blue transition-colors">Cloud Infrastructure</Link></li>
                        <li><Link href="#" className="hover:text-structura-blue transition-colors">Cybersecurity</Link></li>
                        <li><Link href="#" className="hover:text-structura-blue transition-colors">DevOps Automation</Link></li>
                        <li><Link href="#" className="hover:text-structura-blue transition-colors">Data Governance</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-6">Company</h4>
                    <ul className="space-y-4 text-sm text-slate-400">
                        <li><Link href="#" className="hover:text-structura-blue transition-colors">About Us</Link></li>
                        <li><Link href="#" className="hover:text-structura-blue transition-colors">Case Studies</Link></li>
                        <li><Link href="#" className="hover:text-structura-blue transition-colors">Careers</Link></li>
                        <li><Link href="#" className="hover:text-structura-blue transition-colors">Partners</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-6">Legal</h4>
                    <ul className="space-y-4 text-sm text-slate-400">
                        <li><Link href="#" className="hover:text-structura-blue transition-colors">Privacy Policy</Link></li>
                        <li><Link href="#" className="hover:text-structura-blue transition-colors">Terms of Service</Link></li>
                        <li><Link href="#" className="hover:text-structura-blue transition-colors">SLA Agreement</Link></li>
                        <li><Link href="#" className="hover:text-structura-blue transition-colors">Security Trust</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 relative z-10">
                <p>&copy; 2024 Structura IT Services. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <Link href="#" className="hover:text-white transition-colors"><Twitter className="w-4 h-4" /></Link>
                    <Link href="#" className="hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></Link>
                    <Link href="#" className="hover:text-white transition-colors"><Github className="w-4 h-4" /></Link>
                </div>
            </div>
        </footer>
    );
}
