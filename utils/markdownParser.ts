import { BlogPost } from '../types';

export const parseMarkdownPost = (id: string, rawContent: string): BlogPost => {
  // Regex to match YAML frontmatter bounded by ---
  // Updated to be more permissive with leading whitespace
  const frontmatterRegex = /^\s*---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+([\s\S]*)$/;
  const match = frontmatterRegex.exec(rawContent);

  if (!match) {
    // Fallback if no frontmatter is found, return content as is with untitled header
    return {
      id,
      title: 'Untitled',
      date: new Date().toISOString(),
      author: 'Harun Aksaya',
      content: rawContent,
      tags: []
    };
  }

  const frontmatterBlock = match[1];
  const content = match[2];
  
  const metadata: Record<string, string> = {};
  
  frontmatterBlock.split('\n').forEach(line => {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join(':').trim();
      // Remove quotes if present
      metadata[key] = value.replace(/^['"](.*)['"]$/, '$1');
    }
  });

  // Parse tags: expecting comma separated string in frontmatter like "tags: productivity, marketing"
  let tags: string[] = [];
  if (metadata.tags) {
    tags = metadata.tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
  }

  return {
    id,
    title: metadata.title || 'Untitled',
    date: metadata.date || new Date().toISOString(),
    author: metadata.author || 'Harun Aksaya',
    content: content.trim(),
    tags
  };
};