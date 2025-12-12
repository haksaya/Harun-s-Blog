import { parseMarkdownPost } from './utils/markdownParser.js';

// Import ONLY the kept post for the fallback mechanism
import aiJobPost from './posts/general-ai-wont-take-jobs.js';

let rawPosts = [];

// Modern & Best Practice: Vite Glob Import
// We attempt to use Vite's automatic glob import.
// If the environment is not processed by Vite (e.g. raw browser), 'import.meta.glob' will be undefined.
// We catch this case and fall back to the manual list.
try {
    if (import.meta && typeof import.meta.glob === 'function') {
        // We explicitly specify the single file we want to keep.
        // This ensures that even if other .md files exist in the folder, they are ignored.
        const modules = import.meta.glob('./posts/general-ai-wont-take-jobs.md', { 
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
    
    // Fallback: Manual List containing ONLY the kept post
    rawPosts = [
        { id: 'general-ai-wont-take-jobs', content: aiJobPost },
    ];
}

export const INITIAL_POSTS = rawPosts
    .map(p => parseMarkdownPost(p.id, p.content))
    .sort((a, b) => new Date(b.date) - new Date(a.date));