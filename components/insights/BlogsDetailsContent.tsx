'use client';

import { motion } from 'framer-motion';
import { Calendar, User, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { Link } from '@/src/i18n/navigation';
import GlobalContactForm from '@/components/GlobalContactForm';

export function BlogsDetailsContent({ post, contentHtml }: { post: any, contentHtml: string }) {
    return (
        <main className="pt-20 bg-white min-h-screen">
            {/* HEADER */}
            <section className="relative py-20 bg-slate-50 border-b border-slate-200">
                <div className="max-w-4xl mx-auto px-6">
                    <Link href="/insights/blogs" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-structura-black mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Blogs
                    </Link>

                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 rounded-full bg-structura-blue/10 text-structura-blue text-xs font-bold uppercase tracking-wider">
                            {post.category || "General"}
                        </span>
                        <span className="text-slate-400 text-sm flex items-center gap-1"><Clock className="w-3 h-3" /> 5 min read</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-display font-bold text-structura-black mb-8 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-structura-black text-white flex items-center justify-center font-bold">
                                {(post.author || "A").charAt(0)}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-structura-black">{post.author || "Assuvar Team"}</div>
                                <div className="text-xs text-slate-500">{new Date(post.date).toLocaleDateString()}</div>
                            </div>
                        </div>
                        <button className="p-2 rounded-full hover:bg-white transition-colors text-slate-500">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </section>

            {/* CONTENT BODY */}
            <section className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-6">
                    <article
                        className="prose prose-lg prose-slate max-w-none"
                        dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />

                    {post.tags && (
                        <div className="mt-16 pt-8 border-t border-slate-100">
                            <h4 className="font-bold text-structura-black mb-4">Tags</h4>
                            <div className="flex gap-2">
                                {post.tags.map((tag: string) => (
                                    <span key={tag} className="px-3 py-1 bg-slate-50 rounded-full text-xs text-slate-500">#{tag}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* EMBEDDED FORM REMOVED (Handled Globally) */}
                    {/* Optional: Add a simple link/text if needed, but for now removing to avoid duplication */}
                </div>
            </section>
        </main>
    );
}
