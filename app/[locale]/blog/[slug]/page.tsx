import { getPostData, getSortedPostsData } from '@/src/lib/cms';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';
import { Link } from '@/src/i18n/navigation';

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }) {
    const post = await getPostData('blog', params.slug);
    if (!post) return {};

    // Try to find translated title
    const t = await getTranslations({ locale: params.locale, namespace: `blog.${params.slug}` });
    const title = t('title') !== `blog.${params.slug}.title` ? t('title') : post.title;
    const summary = t('summary') !== `blog.${params.slug}.summary` ? t('summary') : post.summary;

    return {
        title: `${title} | Structura IT`,
        description: summary,
    };
}

export async function generateStaticParams() {
    const posts = await getSortedPostsData('blog');
    return posts.map((post) => ({
        slug: post.id,
    }));
}

export default async function BlogPost({ params }: { params: { locale: string; slug: string } }) {
    const post = await getPostData('blog', params.slug);
    if (!post) notFound();

    // Get translations for dynamic content
    const tPost = await getTranslations({ locale: params.locale, namespace: `blog.${params.slug}` });
    const tCommon = await getTranslations({ locale: params.locale, namespace: 'Common' });

    // Fallback to English/Source if translation key matches the key itself (meaning missing)
    const title = tPost('title') !== `blog.${params.slug}.title` ? tPost('title') : post.title;
    const content = tPost('body') !== `blog.${params.slug}.body` ? tPost('body') : post.contentHtml;

    return (
        <main className="pt-32 pb-24 min-h-screen bg-white">
            <article className="max-w-3xl mx-auto px-6">
                <Link href="/blog" className="inline-flex items-center text-sm text-slate-500 hover:text-structura-blue mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> {tCommon('backToBlog')}
                </Link>

                <header className="mb-12">
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                        <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-medium">
                            {post.category}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(post.date).toLocaleDateString(params.locale)}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-structura-black mb-6 leading-tight">
                        {title}
                    </h1>
                    {post.thumbnail && (
                        <div className="aspect-video rounded-2xl overflow-hidden mb-8 shadow-lg">
                            <img src={post.thumbnail} alt={title} className="w-full h-full object-cover" />
                        </div>
                    )}
                </header>

                <div
                    className="prose prose-lg prose-slate max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-structura-blue"
                    dangerouslySetInnerHTML={{ __html: content }}
                />

                <div className="mt-12 pt-8 border-t border-slate-200">
                    <div className="flex flex-wrap gap-2">
                        {post.tags && post.tags.map((tag: string) => (
                            <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-sm text-slate-600">
                                <Tag className="w-3 h-3" /> {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </article>
        </main>
    );
}
