import { getSortedPostsData } from '@/src/lib/cms';
import { Link } from '@/src/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { ArrowRight, Calendar, Tag } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const posts = await getSortedPostsData('blog');
    const tCommon = await getTranslations({ locale: locale, namespace: 'Common' });

    // Use a try-catch for each post to safely access translations
    const translatedPosts = await Promise.all(posts.map(async (post) => {
        let tPost;
        try {
            tPost = await getTranslations({ locale: locale, namespace: `blog.${post.id}` });
        } catch (error) {
            tPost = null;
        }

        const title = tPost && tPost('title') !== `blog.${post.id}.title` ? tPost('title') : post.title;
        const summary = tPost && tPost('summary') !== `blog.${post.id}.summary` ? tPost('summary') : post.summary;

        return { ...post, translatedTitle: title, translatedSummary: summary };
    }));

    return (
        <main className="pt-32 pb-24 min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-structura-black">Engineering Blog</h1>
                    <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                        Deep dives into scalable architecture, cloud infrastructure, and modern web development patterns by the Structura engineering team.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {translatedPosts.map((post) => (
                        <Link href={`/blog/${post.id}`} key={post.id} className="group flex flex-col bg-white rounded-2xl border border-structura-border overflow-hidden hover:shadow-xl hover:border-structura-blue/30 transition-all duration-300">
                            {post.image && (
                                <div className="h-56 overflow-hidden border-b border-structura-border">
                                    <img
                                        src={post.image}
                                        alt={post.translatedTitle}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                </div>
                            )}
                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex items-center gap-3 text-xs font-mono text-slate-500 mb-4">
                                    <span className="bg-blue-50 text-structura-blue px-2.5 py-1 rounded-md font-bold tracking-wide">
                                        {post.category || 'Tech'}
                                    </span>
                                    <span className="flex items-center">
                                        <Calendar className="w-3.5 h-3.5 mr-1" />
                                        {formatDate(post.date)}
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold text-structura-black mb-3 group-hover:text-structura-blue transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-slate-600 text-sm mb-6 flex-1 line-clamp-3">
                                    {post.summary}
                                </p>
                                <div className="flex items-center text-structura-blue text-sm font-semibold mt-auto">
                                    {tCommon('readMore')} <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
