import Link from 'next/link';
import { Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-structura-border pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
                <div className="col-span-2">
                    <Link href="#" className="flex items-center gap-2 mb-6">
                        <div className="w-6 h-6 bg-structura-black text-white flex items-center justify-center rounded-md">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                            </svg>
                        </div>
                        <span className="text-lg font-display font-bold">Structura<span className="text-structura-blue">IT</span></span>
                    </Link>
                    <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                        Building the digital foundations for tomorrow&apos;s enterprises. <br /> Robust. Secure. Scalable.
                    </p>
                    <div className="mt-8 pt-8 border-t border-slate-100">
                        <h5 className="text-xs font-bold text-slate-400 mb-4 uppercase">Our Evolution</h5>
                        <div className="flex gap-4 text-xs font-mono text-slate-500">
                            <div>
                                <span className="block font-bold text-structura-black">2015</span>
                                Founded
                            </div>
                            <div className="w-px bg-slate-200"></div>
                            <div>
                                <span className="block font-bold text-structura-black">2019</span>
                                Series B
                            </div>
                            <div className="w-px bg-slate-200"></div>
                            <div>
                                <span className="block font-bold text-structura-black">2024</span>
                                Global
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-structura-black mb-6">Capabilities</h4>
                    <ul className="space-y-4 text-sm text-slate-500">
                        <li><Link href="#" className="hover:text-structura-blue transition-colors">Cloud Infrastructure</Link></li>
                        <li><Link href="#" className="hover:text-structura-blue transition-colors">Cybersecurity</Link></li>
                        <li><Link href="#" className="hover:text-structura-blue transition-colors">DevOps Automation</Link></li>
                        <li><Link href="#" className="hover:text-structura-blue transition-colors">Data Governance</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-structura-black mb-6">Company</h4>
                    <ul className="space-y-4 text-sm text-slate-500">
                        <li><Link href="#" className="hover:text-structura-blue transition-colors">About Us</Link></li>
                        <li><Link href="#" className="hover:text-structura-blue transition-colors">Case Studies</Link></li>
                        <li><Link href="#" className="hover:text-structura-blue transition-colors">Careers</Link></li>
                        <li><Link href="#" className="hover:text-structura-blue transition-colors">Partners</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-structura-black mb-6">Legal</h4>
                    <ul className="space-y-4 text-sm text-slate-500">
                        <li><Link href="#" className="hover:text-structura-blue transition-colors">Privacy Policy</Link></li>
                        <li><Link href="#" className="hover:text-structura-blue transition-colors">Terms of Service</Link></li>
                        <li><Link href="#" className="hover:text-structura-blue transition-colors">SLA Agreement</Link></li>
                        <li><Link href="#" className="hover:text-structura-blue transition-colors">Security Trust</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
                <p>&copy; 2024 Structura IT Services. All rights reserved.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <Link href="#" className="hover:text-structura-black transition-colors"><Twitter className="w-4 h-4" /></Link>
                    <Link href="#" className="hover:text-structura-black transition-colors"><Linkedin className="w-4 h-4" /></Link>
                    <Link href="#" className="hover:text-structura-black transition-colors"><Github className="w-4 h-4" /></Link>
                </div>
            </div>
        </footer>
    );
}
