import { BlogPost } from '../types';

interface MarkdownModule {
  default: string;
}

// Parse frontmatter from markdown content
function parseFrontmatter(content: string): { metadata: Record<string, any>; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { metadata: {}, content };
  }

  const frontmatterText = match[1];
  const markdownContent = match[2];

  const metadata: Record<string, any> = {};
  frontmatterText.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      
      // Parse tags as array
      if (key.trim() === 'tags') {
        metadata[key.trim()] = value.split(',').map(tag => tag.trim());
      } else {
        metadata[key.trim()] = value;
      }
    }
  });

  return { metadata, content: markdownContent.trim() };
}

// Load all markdown posts from posts/ directory
export function loadAllPosts(): BlogPost[] {
  // Use Vite's import.meta.glob to dynamically import all .md files
  const markdownFiles = import.meta.glob<MarkdownModule>('/posts/*.md', { 
    eager: true,
    query: '?raw',
    import: 'default'
  });

  const posts: BlogPost[] = [];

  for (const [path, content] of Object.entries(markdownFiles)) {
    if (typeof content === 'string') {
      const { metadata, content: markdownContent } = parseFrontmatter(content);
      
      // Extract filename as ID
      const filename = path.split('/').pop()?.replace('.md', '') || 'untitled';

      posts.push({
        id: filename,
        title: metadata.title || 'Untitled',
        date: metadata.date || new Date().toISOString().split('T')[0],
        author: metadata.author || 'Harun Aksaya',
        tags: metadata.tags || [],
        content: markdownContent
      });
    }
  }

  // Sort by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
