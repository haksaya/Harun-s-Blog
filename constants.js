import { parseMarkdownPost } from './utils/markdownParser.js';

// Fallback imports for environments where Vite's import.meta.glob is not available.
// This ensures the app doesn't crash in raw browser environments or specific previews.
import aiJobPost from './posts/general-ai-wont-take-jobs.js';
import yakPost from './posts/dont-shave-that-yak.js';
import qualityPost from './posts/quality-vs-good-enough.js';
import dipPost from './posts/the-dip.js';
import shippingPost from './posts/shipping-creative-work.js';

let rawPosts = [];

// Modern & Best Practice: Vite Glob Import
// We attempt to use Vite's automatic glob import.
// If the environment is not processed by Vite (e.g. raw browser), 'import.meta.glob' will be undefined.
// We catch this case and fall back to the manual list.
try {
    if (import.meta && typeof import.meta.glob === 'function') {
        const modules = import.meta.glob('./posts/*.md', { 
            eager: true, 
            query: '?raw', 
            import: 'default' 
        });

        rawPosts = Object.entries(modules).map(([path, content]) => {
            // Extract filename as ID (e.g. "./posts/example.md" -> "example")
            const id = path.split('/').pop().replace(/\.md$/, '');
            return { id, content };
        });
    } else {
        // Explicitly throw to trigger the catch block if glob is undefined
        throw new Error('import.meta.glob is not a function');
    }
} catch (e) {
    console.log("Environment does not support Vite Glob Import. Using manual fallback.");
    
    // Fallback: Manual List
    rawPosts = [
        { id: 'general-ai-wont-take-jobs', content: aiJobPost },
        { id: 'dont-shave-that-yak', content: yakPost },
        { id: 'quality-vs-good-enough', content: qualityPost },
        { id: 'the-dip', content: dipPost },
        { id: 'shipping-creative-work', content: shippingPost },
    ];
}

export const INITIAL_POSTS = rawPosts
    .map(p => parseMarkdownPost(p.id, p.content))
    .sort((a, b) => new Date(b.date) - new Date(a.date));