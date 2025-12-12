
import { parseMarkdownPost } from './utils/markdownParser.ts';
import aiJobPost from './posts/general-ai-wont-take-jobs.ts';

const rawPosts = [
    { id: '1', content: aiJobPost },
];

export const INITIAL_POSTS = rawPosts.map(p => parseMarkdownPost(p.id, p.content));