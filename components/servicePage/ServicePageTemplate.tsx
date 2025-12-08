'use client';

import { Service } from '@/src/lib/servicesData';
import { Link } from '@/src/i18n/navigation';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

interface ServicePageProps {
    service: Service;
}

export default function ServicePageTemplate({ service }: ServicePageProps) {
    return (
        <main className="min-h-screen bg-white pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-6">
                {/* Breadcrumb / Back */}
                <div className="mb-8">
                    <Link
                        href={`/services/${service.category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                        className="inline-flex items-center text-sm text-slate-500 hover:text-[#6A0DAD] transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to {service.category}
                    </Link>
                </div>

                {/* Hero Section */}
                <section className="mb-16">
                    <span className="inline-block py-1 px-3 rounded-full bg-purple-50 text-[#6A0DAD] text-xs font-bold uppercase tracking-wider mb-4">
                        {service.category}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-structura-black mb-6">
                        {service.title}
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
                        {service.shortIntro}
                    </p>
                </section>

                {/* Why Choose Us Placeholder */}
                <section className="mb-16 py-12 border-y border-slate-100">
                    <h2 className="text-2xl font-bold text-structura-black mb-8">Why Choose Our {service.title}?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-6 bg-slate-50 rounded-xl border border-slate-100 hover:border-purple-100 transition-colors">
                                <CheckCircle2 className="w-8 h-8 text-[#6A0DAD] mb-4" />
                                <h3 className="font-bold text-lg mb-2">Benefit {i}</h3>
                                <p className="text-slate-600 text-sm">
                                    We deliver top-tier results tailored to your business needs, ensuring scalability and efficiency.
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Technologies Placeholder */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-structura-black mb-8">Technologies Used</h2>
                    <div className="flex flex-wrap gap-4">
                        {['React', 'Next.js', 'Python', 'AWS', 'Node.js', 'Typescript'].map((tech) => (
                            <span key={tech} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-medium text-sm">
                                {tech}
                            </span>
                        ))}
                    </div>
                </section>

                {/* Case Studies Placeholder */}
                <section className="bg-structura-black text-white rounded-3xl p-8 md:p-12 text-center">
                    <h2 className="text-2xl font-bold mb-4">See {service.title} in Action</h2>
                    <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                        Explore our success stories and see how we've helped other businesses achieve their goals with our services.
                    </p>
                    <button className="px-8 py-3 bg-[#6A0DAD] hover:bg-purple-700 text-white font-bold rounded-lg transition-colors">
                        Case Studies Coming Soon
                    </button>
                </section>
            </div>
        </main>
    );
}
