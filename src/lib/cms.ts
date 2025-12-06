import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDirectory = path.join(process.cwd(), 'data');

export async function getSortedPostsData(type: 'blog' | 'news') {
    const dir = path.join(contentDirectory, type);
    if (!fs.existsSync(dir)) return [];

    const fileNames = fs.readdirSync(dir);
    const allPostsData = fileNames.map((fileName) => {
        const id = fileName.replace(/\.md$/, '');
        const fullPath = path.join(dir, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);

        return {
            id,
            ...(matterResult.data as { date: string; title: string; summary?: string; thumbnail?: string; tags?: string[]; category?: string; image?: string; highlight?: boolean;[key: string]: any }),
        };
    });

    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export async function getPostData(type: 'blog' | 'news', id: string) {
    const fullPath = path.join(contentDirectory, type, `${id}.md`);
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    return {
        id,
        contentHtml,
        ...(matterResult.data as { date: string; title: string; summary?: string; thumbnail?: string; tags?: string[]; category?: string; image?: string; highlight?: boolean;[key: string]: any }),
    };
}
