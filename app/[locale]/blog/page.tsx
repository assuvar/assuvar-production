import { getSortedPostsData } from '@/src/lib/cms';
import { Link } from '@/src/i18n/navigation';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { ArrowRight, Calendar, Tag } from 'lucide-react';

export async function generateMetadata({ params }: { params: { locale: string } }) {
    const t = await getTranslations({ locale: params.locale, namespace: 'Blog' });
    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
    };
}

export default async function BlogIndex({ params }: { params: { locale: string } }) {
    const posts = await getSortedPostsData('blog');
    const t = await getTranslations({ locale: params.locale, namespace: 'Blog' });
    const tCommon = await getTranslations({ locale: params.locale, namespace: 'Common' });

    return (
        <main className="pt-32 pb-24 min-h-screen bg-slate-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-structura-black mb-6" data-i18n="blog.title">
                        {t('title')}
                    </h1>
                    <p className="text-lg text-slate-600" data-i18n="blog.subtitle">
                        {t('subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <Link href={`/blog/${post.id}`} key={post.id} className="group">
                            <article className="bg-white rounded-2xl overflow-hidden border border-structura-border shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                                <div className="aspect-video bg-slate-200 relative overflow-hidden">
                                    {post.thumbnail && (
                                        <img
                                            src={post.thumbnail}
                                            alt={post.title}
                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                        />
                                    )}
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-structura-blue">
                                        {post.category}
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(post.date).toLocaleDateString(params.locale)}
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
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}
