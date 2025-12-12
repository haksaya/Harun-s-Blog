
import { parseMarkdownPost } from './utils/markdownParser';
import aiJobPost from './posts/general-ai-wont-take-jobs';

const rawPosts = [
    { id: '1', content: aiJobPost },
];

export const INITIAL_POSTS = rawPosts.map(p => parseMarkdownPost(p.id, p.content));
