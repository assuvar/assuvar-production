import { getAllPosts } from '@/lib/blog';
import BlogsList from '@/components/insights/BlogsList';

export default function BlogsPage() {
    // Fetch all posts from the file system
    const allPosts = getAllPosts([
        'title',
        'date',
        'slug',
        'author',
        'thumbnail',
        'excerpt',
        'summary',
        'category'
    ]);

    return (
        <BlogsList posts={allPosts} />
    );
}
