'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Send, User, Mail, Phone, MapPin, Building2, Briefcase, Info } from 'lucide-react';

interface GlobalContactFormProps {
    mode?: 'client' | 'partner';
    className?: string;
    onSuccess?: () => void;
    compact?: boolean;
}

export default function GlobalContactForm({ mode = 'client', className = '', onSuccess, compact = false }: GlobalContactFormProps) {
    const pathname = usePathname();
    const [pageSource, setPageSource] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    useEffect(() => {
        setPageSource(pathname || window.location.pathname);
    }, [pathname]);

    const formName = mode === 'partner' ? 'assuvar-partner' : (compact ? 'assuvar-contact-compact' : 'assuvar-contact');
    const subject = `New Submission: ${formName} (${new Date().toLocaleDateString()})`;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('submitting');

        const form = e.currentTarget;
        const formData = new FormData(form);

        const payload = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            source: 'Website – Contact Page', // Hardcoded for this form
            notes: formData.get('message'),
            // Optional: Map service to serviceInterest (as array) if present
            serviceInterest: formData.get('service') ? [formData.get('service')] : [],
            // Client dashboard might have specific implementation details
        };

        try {
            // Using direct fetch to our backend API
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/leads/public`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setStatus('success');
                if (onSuccess) onSuccess();
                form.reset();
            } else {
                const errData = await response.json();
                throw new Error(errData.message || 'Network response was not ok.');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className={`bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-slate-100 flex flex-col items-center justify-center text-center space-y-4 min-h-[400px] ${className}`}>
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-2">
                    <Send className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-structura-black">Message Sent!</h3>
                <p className="text-slate-500 max-w-xs">
                    Thank you for contacting Assuvar. Our team will get back to you within 24 hours.
                </p>
                <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors text-sm"
                >
                    Send Another
                </button>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-slate-100 ${className}`}>
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-structura-black mb-2">
                    {mode === 'partner' ? 'Partner With Us' : (compact ? 'Get in Touch' : 'Start Your Project')}
                </h3>
                <p className="text-slate-500 text-sm">
                    {mode === 'partner'
                        ? 'Join our network of innovators and engineering leaders.'
                        : (compact ? 'Have a project in mind? Let’s talk.' : 'Tell us about your engineering challenges. We build solutions.')}
                </p>
            </div>

            <form
                name={formName}
                onSubmit={handleSubmit}
                data-netlify="true"
                netlify-honeypot="bot-field"
                className="space-y-6"
            >
                {/* Netlify Hidden Fields */}
                <input type="hidden" name="form-name" value={formName} />
                <input type="hidden" name="bot-field" />
                <input type="hidden" name="form-type" value={mode} />
                <input type="hidden" name="page-source" value={pageSource} />
                <input type="hidden" name="subject" value={subject} />

                {/* COMPACT MODE FIELDS */}
                {compact && mode === 'client' ? (
                    <>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Full Name *</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input type="text" name="name" required className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-structura-blue/20 focus:border-structura-blue transition-all" placeholder="John Doe" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Business Email *</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input type="email" name="email" required className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-structura-blue/20 focus:border-structura-blue transition-all" placeholder="john@company.com" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Service Needed</label>
                            <div className="relative">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <select name="service" required className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-structura-blue/20 focus:border-structura-blue transition-all appearance-none text-slate-600">
                                    <option value="" disabled selected>Select Service</option>
                                    <option value="data">Data & Analytics</option>
                                    <option value="product">Product Engineering</option>
                                    <option value="automation">Intelligent Automation</option>
                                    <option value="quality">Quality Engineering</option>
                                    <option value="cloud">Cloud & DevOps</option>
                                    <option value="ai">AI Solutions</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                    </>
                ) : (
                    /* FULL MODE FIELDS */
                    <>
                        {/* SHARED FIELDS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Full Name *</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input type="text" name="name" required className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-structura-blue/20 focus:border-structura-blue transition-all" placeholder="John Doe" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Business Email *</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input type="email" name="email" required className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-structura-blue/20 focus:border-structura-blue transition-all" placeholder="john@company.com" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Phone Number *</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input type="tel" name="phone" required className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-structura-blue/20 focus:border-structura-blue transition-all" placeholder="+1 (555) 000-0000" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Location / Country *</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input type="text" name="location" required className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-structura-blue/20 focus:border-structura-blue transition-all" placeholder="New York, USA" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Company Name *</label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input type="text" name="company" required className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-structura-blue/20 focus:border-structura-blue transition-all" placeholder="Acme Corp" />
                                </div>
                            </div>
                            {mode === 'client' && (
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Your Role *</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input type="text" name="role" required className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-structura-blue/20 focus:border-structura-blue transition-all" placeholder="CTO, Product Manager, etc." />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* CLIENT SPECIFIC FIELDS */}
                        {mode === 'client' && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Industry *</label>
                                        <div className="relative">
                                            <select name="industry" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-structura-blue/20 focus:border-structura-blue transition-all appearance-none text-slate-600">
                                                <option value="" disabled selected>Select Industry</option>
                                                <option value="retail">Retail & Ecommerce</option>
                                                <option value="manufacturing">Manufacturing</option>
                                                <option value="real-estate">Real Estate</option>
                                                <option value="healthcare">Healthcare</option>
                                                <option value="education">Education</option>
                                                <option value="agency">Agency / Services</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">How did you hear about us?</label>
                                        <div className="relative">
                                            <select name="referrer" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-structura-blue/20 focus:border-structura-blue transition-all appearance-none text-slate-600">
                                                <option value="" disabled selected>Select Source</option>
                                                <option value="linkedin">LinkedIn</option>
                                                <option value="search">Search Engine</option>
                                                <option value="referral">Referral</option>
                                                <option value="instagram">Instagram</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Service Category Needed *</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {["Data & Analytics", "Product Engineering", "Intelligent Automation", "Quality Engineering", "Cloud & DevOps", "AI Solutions", "Consultation Only"].map(service => (
                                            <label key={service} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer p-2 rounded hover:bg-slate-50 transition-colors">
                                                <input type="checkbox" name="services" value={service} className="w-4 h-4 rounded text-structura-blue focus:ring-structura-blue border-slate-300" />
                                                {service}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Project Timeline</label>
                                    <div className="flex flex-wrap gap-4">
                                        {["Immediately", "1-3 Months", "3-6 Months", "6-12 Months", "Not decided"].map(time => (
                                            <label key={time} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                                <input type="radio" name="timeline" value={time} className="w-4 h-4 text-structura-blue focus:ring-structura-blue border-slate-300" />
                                                {time}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Additional Requirements (Optional)</label>
                                    <textarea name="message" rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-structura-blue/20 focus:border-structura-blue transition-all" placeholder="Any specific details about your project..."></textarea>
                                </div>
                            </>
                        )}

                        {/* PARTNER SPECIFIC FIELDS */}
                        {mode === 'partner' && (
                            <>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Partnership Type *</label>
                                    <select name="partnership-type" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-structura-blue/20 focus:border-structura-blue transition-all appearance-none text-slate-600">
                                        <option value="" disabled selected>Select Type</option>
                                        <option value="reseller">Reseller</option>
                                        <option value="affiliate">Affiliate</option>
                                        <option value="integration">Integration Partner</option>
                                        <option value="services">Services Partner</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Message *</label>
                                    <textarea name="message" required rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-structura-blue/20 focus:border-structura-blue transition-all" placeholder="Tell us how you would like to partner..."></textarea>
                                </div>
                            </>
                        )}
                    </>
                )}

                {/* TRUST BADGES & SUBMIT */}
                <div className="pt-4 border-t border-slate-100 mt-6">
                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full py-4 bg-structura-black text-white font-bold rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {status === 'submitting' ? 'Sending...' : (compact ? 'Get a Call Back' : 'Submit Request')}
                            {status !== 'submitting' && <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </span>
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-brand-gradient"></div>
                    </button>

                    {status === 'error' && (
                        <p className="text-center text-red-500 text-sm mt-3">
                            Something went wrong. Please try again or email us directly at team@assuvar.com.
                        </p>
                    )}

                    {!compact && (
                        <div className="flex justify-center gap-6 mt-6 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><Info className="w-3 h-3" /> Secure Data Handling</span>
                            <span className="flex items-center gap-1"><Info className="w-3 h-3" /> GDPR Friendly</span>
                            <span className="flex items-center gap-1"><Info className="w-3 h-3" /> Encrypted</span>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}
