import { getPostData, getSortedPostsData } from '@/src/lib/cms';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Link } from '@/src/i18n/navigation';

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }) {
    const post = await getPostData('news', params.slug);
    if (!post) return {};

    const t = await getTranslations({ locale: params.locale, namespace: `news.${params.slug}` });
    const title = t('title') !== `news.${params.slug}.title` ? t('title') : post.title;

    return {
        title: `${title} | Structura IT News`,
    };
}

export async function generateStaticParams() {
    const posts = await getSortedPostsData('news');
    return posts.map((post) => ({
        slug: post.id,
    }));
}

export default async function NewsPost({ params }: { params: { locale: string; slug: string } }) {
    const post = await getPostData('news', params.slug);
    if (!post) notFound();

    const tPost = await getTranslations({ locale: params.locale, namespace: `news.${params.slug}` });
    const tCommon = await getTranslations({ locale: params.locale, namespace: 'Common' });

    const title = tPost('title') !== `news.${params.slug}.title` ? tPost('title') : post.title;
    const content = tPost('body') !== `news.${params.slug}.body` ? tPost('body') : post.contentHtml;

    return (
        <main className="pt-32 pb-24 min-h-screen bg-slate-50">
            <article className="max-w-4xl mx-auto px-6">
                <Link href="/news" className="inline-flex items-center text-sm text-slate-500 hover:text-structura-blue mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> {tCommon('backToNews')}
                </Link>

                <div className="bg-white rounded-2xl border border-structura-border shadow-sm overflow-hidden">
                    {post.image && (
                        <div className="w-full h-64 md:h-96 relative">
                            <img src={post.image} alt={title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white">
                                <div className="flex items-center gap-2 text-sm font-mono opacity-80 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(post.date).toLocaleDateString(params.locale)}
                                </div>
                                <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-2xl">
                                    {title}
                                </h1>
                            </div>
                        </div>
                    )}

                    <div className="p-8 md:p-12">
                        <div
                            className="prose prose-lg prose-slate max-w-none"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </div>
                </div>
            </article>
        </main>
    );
}
