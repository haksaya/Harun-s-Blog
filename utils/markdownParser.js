
export const parseMarkdownPost = (id, rawContent) => {
  if (!rawContent) {
    console.warn(`Post content missing for ID: ${id}`);
    return {
      id,
      title: 'Content Unavailable',
      date: new Date().toISOString(),
      author: 'System',
      content: 'This post could not be loaded.',
      tags: []
    };
  }

  const frontmatterRegex = /^\s*---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+([\s\S]*)$/;
  const match = frontmatterRegex.exec(rawContent);

  if (!match) {
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
  
  const metadata = {};
  
  frontmatterBlock.split('\n').forEach(line => {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join(':').trim();
      metadata[key] = value.replace(/^['"](.*)['"]$/, '$1');
    }
  });

  let tags = [];
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