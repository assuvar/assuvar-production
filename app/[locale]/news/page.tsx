import { getSortedPostsData } from '@/src/lib/cms';
import { Link } from '@/src/i18n/navigation';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { ArrowRight, Calendar } from 'lucide-react';

export async function generateMetadata({ params }: { params: { locale: string } }) {
    const t = await getTranslations({ locale: params.locale, namespace: 'News' });
    return {
        title: t('metaTitle'),
        description: t('metaDescription'),
    };
}

export default async function NewsIndex({ params }: { params: { locale: string } }) {
    const posts = await getSortedPostsData('news');
    const t = await getTranslations({ locale: params.locale, namespace: 'News' });
    const tCommon = await getTranslations({ locale: params.locale, namespace: 'Common' });

    return (
        <main className="pt-32 pb-24 min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-structura-black mb-4" data-i18n="news.title">
                            {t('title')}
                        </h1>
                        <p className="text-lg text-slate-600 max-w-xl" data-i18n="news.subtitle">
                            {t('subtitle')}
                        </p>
                    </div>
                </div>

                <div className="space-y-8">
                    {posts.map((post) => (
                        <Link href={`/news/${post.id}`} key={post.id} className="block group">
                            <article className="flex flex-col md:flex-row gap-8 items-start border-b border-slate-100 pb-8 hover:bg-slate-50/50 transition-colors p-4 rounded-xl -mx-4">
                                <div className="w-full md:w-1/3 aspect-[4/3] rounded-xl overflow-hidden bg-slate-200 shrink-0">
                                    {post.image && (
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                        />
                                    )}
                                </div>
                                <div className="flex-1 pt-2">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(post.date).toLocaleDateString(params.locale)}
                                        </span>
                                        {post.highlight && (
                                            <span className="px-2 py-0.5 rounded bg-structura-blue/10 text-structura-blue text-[10px] font-bold uppercase tracking-wider">
                                                Highlight
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="text-2xl font-bold text-structura-black mb-4 group-hover:text-structura-blue transition-colors">
                                        {post.title}
                                    </h2>
                                    <div className="flex items-center text-structura-blue text-sm font-semibold">
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
