'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, Clock } from 'lucide-react';
import { Link } from '@/src/i18n/navigation';

type BlogProps = {
    id?: string;
    title: string;
    excerpt?: string; // summary in CMS
    summary?: string;
    category?: string;
    author?: string; // might not exist in CMS yet, distinct from body
    date: string;
    readTime?: string; // derived or mock
    slug: string;
    thumbnail?: string; // image in CMS
    image?: string;
};

export default function BlogsList({ posts }: { posts: any[] }) {
    const [filter, setFilter] = useState("All");

    // Normalize CMS data to UI expectation
    const normalizedPosts: BlogProps[] = posts.map(p => ({
        id: p.slug,
        title: p.title,
        excerpt: p.summary || p.excerpt || "No summary available.",
        category: p.category || "General",
        author: "Assuvar Team", // default if missing
        date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: "5 min read", // Placeholder logic
        slug: p.slug,
        image: p.thumbnail || "/assets/blog-placeholder.webp"
    }));

    const categories = ["All", ...Array.from(new Set(normalizedPosts.map(b => b.category)))];

    const filteredBlogs = filter === "All"
        ? normalizedPosts
        : normalizedPosts.filter(b => b.category === filter);

    return (
        <main className="pt-20 bg-white min-h-screen">
            {/* HERO */}
            <section className="relative py-24 bg-white overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-5 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-structura-blue via-transparent to-transparent"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-display font-bold text-structura-black mb-6"
                    >
                        Insights & <span className="text-structura-black">Perspectives</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed"
                    >
                        Deep dives into engineering, architecture, and the future of tech.
                    </motion.p>
                </div>
            </section>

            {/* FILTERS */}
            <section className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4">
                <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-3">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === cat
                                ? 'bg-structura-black text-white shadow-md'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            {/* BLOG GRID */}
            <section className="py-20 bg-slate-50 min-h-[600px]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredBlogs.map((blog, idx) => (
                            <motion.article
                                key={blog.slug} // Use slug as key
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-structura-blue/5 transition-all duration-300 group flex flex-col h-full"
                            >
                                <div className="h-48 bg-slate-200 relative overflow-hidden">
                                    {/* If real image exists, use it. For now, using placeholder logic */}
                                    {blog.image && !blog.image.includes('placeholder') ? (
                                        <div
                                            className="absolute inset-0 bg-cover bg-center"
                                            style={{ backgroundImage: `url(${blog.image})` }}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-100">
                                            <span className="text-sm">Image: {blog.title}</span>
                                        </div>
                                    )}

                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-structura-blue">
                                        {blog.category}
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {blog.date}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {blog.readTime}</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-structura-black mb-3 group-hover:text-structura-blue transition-colors line-clamp-2">
                                        {blog.title}
                                    </h2>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                                        {blog.excerpt}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-medium text-slate-700">{blog.author}</span>
                                        </div>
                                        <Link href={`/insights/blogs/${blog.slug}`} className="text-sm font-bold text-structura-black flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Read <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-white text-center border-t border-slate-100">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-structura-black mb-6">Have a specific <span className="text-structura-black">challenge?</span></h2>
                    <p className="text-slate-500 mb-10 text-lg">Let our engineering team provide the insights you need.</p>
                    <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-structura-black text-white rounded-full font-bold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 group">
                        Get Consultation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
