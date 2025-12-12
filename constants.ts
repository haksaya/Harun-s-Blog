
import { parseMarkdownPost } from './utils/markdownParser';

// Markdown content is exported as strings from these TS files
// Importing without extension relies on standard Node/Bundler resolution logic
import aiJobPost from './posts/general-ai-wont-take-jobs';
import yakPost from './posts/dont-shave-that-yak';
import qualityPost from './posts/quality-vs-good-enough';
import dipPost from './posts/the-dip';

const rawPosts = [
    { id: 'general-ai-wont-take-jobs', content: aiJobPost },
    { id: 'dont-shave-that-yak', content: yakPost },
    { id: 'quality-vs-good-enough', content: qualityPost },
    { id: 'the-dip', content: dipPost },
];

export const INITIAL_POSTS = rawPosts.map(p => parseMarkdownPost(p.id, p.content));
