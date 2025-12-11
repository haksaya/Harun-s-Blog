
import { parseMarkdownPost } from './utils/markdownParser';
import post1Raw from './posts/dont-shave-that-yak';
import post2Raw from './posts/quality-vs-good-enough';
import post3Raw from './posts/the-dip';

const rawPosts = [
    { id: '1', content: post1Raw },
    { id: '2', content: post2Raw },
    { id: '3', content: post3Raw },
];

export const INITIAL_POSTS = rawPosts.map(p => parseMarkdownPost(p.id, p.content));
