
import { parseMarkdownPost } from './utils/markdownParser.js';

import aiJobPost from './posts/general-ai-wont-take-jobs.js';
import yakPost from './posts/dont-shave-that-yak.js';
import qualityPost from './posts/quality-vs-good-enough.js';
import dipPost from './posts/the-dip.js';

const rawPosts = [
    { id: 'general-ai-wont-take-jobs', content: aiJobPost },
    { id: 'dont-shave-that-yak', content: yakPost },
    { id: 'quality-vs-good-enough', content: qualityPost },
    { id: 'the-dip', content: dipPost },
];

export const INITIAL_POSTS = rawPosts.map(p => parseMarkdownPost(p.id, p.content));
