
import { parseMarkdownPost } from './utils/markdownParser.ts';
import aiJobPost from './posts/general-ai-wont-take-jobs.ts';
import yakPost from './posts/dont-shave-that-yak.ts';
import qualityPost from './posts/quality-vs-good-enough.ts';
import dipPost from './posts/the-dip.ts';

const rawPosts = [
    { id: 'general-ai-wont-take-jobs', content: aiJobPost },
    { id: 'dont-shave-that-yak', content: yakPost },
    { id: 'quality-vs-good-enough', content: qualityPost },
    { id: 'the-dip', content: dipPost },
];

export const INITIAL_POSTS = rawPosts.map(p => parseMarkdownPost(p.id, p.content));
