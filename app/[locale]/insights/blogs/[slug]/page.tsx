'use client';

import { getPostBySlug, markdownToHtml } from '@/lib/blog';
import { BlogsDetailsContent } from '@/components/insights/BlogsDetailsContent';
import { notFound } from 'next/navigation';

export default async function BlogDetailsPage({ params }: { params: { slug: string } }) {
    const post = getPostBySlug(params.slug, [
        'title',
        'date',
        'slug',
        'author',
        'content',
        'thumbnail',
        'category',
        'summary'
    ]);

    if (!post) {
        notFound();
    }

    const contentHtml = await markdownToHtml(post.content || '');

    return (
        <BlogsDetailsContent post={post} contentHtml={contentHtml} />
    );
}
