import { loadAllPosts } from './utils/postLoader';

// Automatically load all posts from posts/*.md files
export const INITIAL_POSTS = loadAllPosts();
