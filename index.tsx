import React, { useState, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import ReactMarkdown from 'react-markdown';
import { format } from 'date-fns';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Sparkles, X, Loader2, PlusCircle, FilterX, Search, 
  Mail, Github, Linkedin, Twitter, Instagram, GraduationCap, Check, Shuffle,
  ArrowRight, ArrowLeft, Eye, Facebook, Link as LinkIcon
} from 'lucide-react';

// --- TYPES ---
interface BlogPost {
  id: string;
  title: string;
  date: string;
  content: string; // Markdown content
  author: string;
  tags: string[];
}

interface GeneratorConfig {
  topic: string;
  isGenerating: boolean;
}

// --- SERVICES: Analytics ---
const GA_TRACKING_ID = 'G-W0YED0N94E';

const initGA = () => {
  if (typeof window === 'undefined') return;
  if (document.getElementById('ga-script')) return;

  const script = document.createElement('script');
  script.id = 'ga-script';
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // @ts-ignore
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    // @ts-ignore
    window.dataLayer.push(args);
  }
  // @ts-ignore
  window.gtag = gtag;
  
  gtag('js', new Date());
  gtag('config', GA_TRACKING_ID, { send_page_view: false });
};

const logPageView = (title: string, path: string) => {
  // @ts-ignore
  if (typeof window !== 'undefined' && window.gtag) {
    // @ts-ignore
    window.gtag('event', 'page_view', { page_title: title, page_path: path });
  }
};

const logEvent = (action: string, category: string, label: string) => {
  // @ts-ignore
  if (typeof window !== 'undefined' && window.gtag) {
    // @ts-ignore
    window.gtag('event', action, { event_category: category, event_label: label });
  }
};

// --- SERVICES: View Count ---
const getStoredViewCount = (id: string): number => {
  if (typeof window === 'undefined') return 0;
  const key = `blog_views_${id}`;
  const stored = localStorage.getItem(key);
  if (stored) return parseInt(stored, 10);
  
  // Fake deterministic start count
  return Math.floor(id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 500) + 50;
};

const incrementStoredViewCount = (id: string): number => {
  if (typeof window === 'undefined') return 0;
  const current = getStoredViewCount(id);
  const next = current + 1;
  localStorage.setItem(`blog_views_${id}`, next.toString());
  return next;
};

// --- SERVICES: Gemini AI ---
const generateSethStylePost = async (topic: string): Promise<{ title: string; content: string; tags: string[] }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a blog post in the style of Seth Godin about "${topic}". 
      Style Guidelines:
      - Short, punchy sentences.
      - Use a rhetorical question or two.
      - Focus on marketing, leadership, art, or the "lizard brain".
      - Keep it concise (under 300 words).
      - Use simple, direct language.
      - Do not use jargon.
      - The tone should be provocative but inspiring.
      - Generate 3-5 relevant single-word tags (lowercase).
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "content", "tags"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const json = JSON.parse(text);
    return {
      title: json.title || "Untitled",
      content: json.content || "No content generated.",
      tags: json.tags || []
    };
  } catch (error) {
    console.error("Error generating post:", error);
    throw error;
  }
};

// --- UTILS: Markdown Parser ---
const parseMarkdownPost = (id: string, rawContent: string): BlogPost => {
  const frontmatterRegex = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]+([\s\S]*)$/;
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
  const metadata: Record<string, string> = {};
  
  frontmatterBlock.split('\n').forEach(line => {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join(':').trim();
      metadata[key] = value.replace(/^['"](.*)['"]$/, '$1');
    }
  });

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

// --- DATA: Posts ---
const POST_AI = `---
title: General Artificial Intelligence Won't Take Our Jobs
date: ${new Date().toISOString().split('T')[0]}
author: Harun Aksaya
tags: ai, jobs, gai
---

These days, everyone working in jobs outside of manual crafts requiring handiwork is experiencing similar fears.

Will artificial intelligence take my job away?

Actually, this situation is not new. In the 60s, when electronic calculators were invented and reduced to desk size, calculation specialists and educational institutions that trained calculation specialists experienced similar fears. In the 80s, when ATMs started being used in Turkey, bankers worried that they would become unemployed. At the point we've reached, everyone who could adapt to technology and learn quickly continued to do their work and earn their living. I think the key words are being flexible and being able to learn quickly. Those who could do this continued to practice their transforming professions. Those who couldn't were eliminated. Artificial intelligence will eliminate some "bullshit jobs," in David Graeber's phrase. And it should.

In the work we do and the real-life problems we solve, we don't just use our intelligence.  Along with intelligence, we also use our intuition, consciousness, and emotions.  Humanity has succeeded in mathematically modeling intelligence at the point we've reached and has been able to transfer it to machines. However, we don't yet have an approach to model our consciousness, intuition, and emotions.  Perhaps we never will. That's why humans will continue to remain unique. 

One of the areas where generative artificial intelligence is perhaps best at is writing code. Despite this, artificial intelligence won't take away my job as a software developer. Because to do my job as a software developer, I need not only my intelligence but also my consciousness and intuition. This being the case, artificial intelligence can be a powerful tool, a lever, that I use to do the tasks I consider drudgery and to automate them.`;

const rawPosts = [
    { id: '1', content: POST_AI },
];

const INITIAL_POSTS = rawPosts.map(p => parseMarkdownPost(p.id, p.content));

// --- COMPONENTS ---

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="prose prose-lg prose-headings:font-open-sans prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-[#3a3a3a] prose-p:text-[#666666] prose-p:font-open-sans prose-p:font-normal prose-a:text-seth-yellow prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-seth-yellow prose-blockquote:bg-transparent prose-blockquote:pl-4 prose-blockquote:italic prose-img:rounded-sm max-w-none font-open-sans leading-relaxed text-[18px]">
      <ReactMarkdown
        components={{
          h1: ({node, ...props}) => <h2 className="text-2xl font-extrabold mt-8 mb-4 font-open-sans text-[#3a3a3a]" {...props} />,
          h2: ({node, ...props}) => <h3 className="text-xl font-extrabold mt-6 mb-3 font-open-sans text-[#3a3a3a]" {...props} />,
          p: ({node, ...props}) => <p className="mb-5 leading-8 text-[18px] text-[#666666] font-open-sans font-normal" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-2 text-[#666666] font-open-sans font-normal" {...props} />,
          li: ({node, ...props}) => <li className="pl-1" {...props} />,
          a: ({node, ...props}) => <a className="text-seth-yellow hover:text-seth-hover transition-colors font-bold cursor-pointer" {...props} />,
          strong: ({node, ...props}) => <strong className="font-bold text-[#3a3a3a]" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

interface SidebarProps {
  tags: string[];
  selectedTag?: string | null;
  onTagClick?: (tag: string) => void;
  onRandomPostClick?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  tags, 
  selectedTag, 
  onTagClick, 
  onRandomPostClick,
  searchQuery = '',
  onSearchChange
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      window.location.href = `mailto:harunaksaya@example.com?subject=Subscribe Request&body=Please subscribe me to Harun's Blog. My email is: ${email}`;
      setIsSubmitting(false);
      setIsSubscribed(true);
      setEmail('');
    }, 800);
  };

  return (
    <div className="p-8 md:p-10 h-full flex flex-col font-open-sans">
      <div className="mb-10 text-center">
        <img 
          src="https://harunaksaya.github.io/assets/images/photos/haksaya.jpg" 
          alt="Harun Aksaya" 
          className="w-36 h-36 rounded-full mx-auto mb-6 object-cover border-4 border-seth-yellow shadow-sm"
        />
        <div className="flex justify-center items-center space-x-3 mb-8">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-seth-yellow transition-colors transform hover:scale-110"><Github size={20} /></a>
            <a href="https://scholar.google.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-seth-yellow transition-colors transform hover:scale-110"><GraduationCap size={20} /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-seth-yellow transition-colors transform hover:scale-110"><Linkedin size={20} /></a>
            <a href="mailto:email@example.com" className="text-gray-400 hover:text-seth-yellow transition-colors transform hover:scale-110"><Mail size={20} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-seth-yellow transition-colors transform hover:scale-110"><Twitter size={20} /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-seth-yellow transition-colors transform hover:scale-110"><Instagram size={20} /></a>
        </div>
        <h3 className="font-open-sans font-extrabold text-xs uppercase tracking-widest text-[#3a3a3a] mb-3 md:text-left">About</h3>
        <p className="font-open-sans font-medium text-sm text-gray-600 leading-relaxed mb-4 md:text-left">
          Sharing thoughts on technology, life, and the art of making things happen.
        </p>
      </div>

      <div className="mb-10">
        <h3 className="font-open-sans font-extrabold text-xs uppercase tracking-widest text-[#3a3a3a] mb-3">Subscribe</h3>
        {isSubscribed ? (
          <div className="flex items-center space-x-2 text-seth-yellow animate-in fade-in slide-in-from-left-2 duration-300">
            <Check size={16} />
            <span className="font-open-sans font-bold text-sm">Thanks! Check your email app.</span>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-row w-full shadow-sm">
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="me@email.com" 
              className="font-open-sans font-semibold w-full border-2 border-gray-200 focus:border-seth-yellow border-r-0 py-2 px-3 text-sm focus:outline-none rounded-l-md text-[#3a3a3a] placeholder-gray-400 transition-colors"
            />
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="font-open-sans font-extrabold bg-seth-yellow border-2 border-seth-yellow hover:bg-seth-hover hover:border-seth-hover text-[#3a3a3a] text-xs uppercase tracking-widest px-4 rounded-r-md whitespace-nowrap transition-colors disabled:opacity-50 flex items-center justify-center min-w-[80px]"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Sign Up'}
            </button>
          </form>
        )}
      </div>

      <div className="mb-10">
        <h3 className="font-open-sans font-extrabold text-xs uppercase tracking-widest text-[#3a3a3a] mb-3">Search</h3>
        <div className="relative">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Type to search..." 
            className="font-open-sans font-semibold w-full border-b-2 border-gray-200 py-2 text-sm focus:outline-none focus:border-seth-yellow transition-colors bg-transparent text-[#3a3a3a] placeholder-gray-400"
          />
          <Search size={18} className="absolute right-0 top-2 text-gray-400" />
        </div>
      </div>

      {onRandomPostClick && (
        <div className="mb-10">
           <h3 className="font-open-sans font-extrabold text-xs uppercase tracking-widest text-[#3a3a3a] mb-3">Discover</h3>
           <button 
             onClick={onRandomPostClick}
             className="flex items-center font-open-sans font-semibold text-sm text-[#3a3a3a] hover:text-seth-yellow transition-colors group"
           >
             <Shuffle size={18} className="mr-2 text-gray-400 group-hover:text-seth-yellow transition-colors" />
             Random Post
           </button>
        </div>
      )}

       <div className="mb-10 flex-1">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-open-sans font-extrabold text-xs uppercase tracking-widest text-[#3a3a3a]">Tags</h3>
            {selectedTag && (
                <button onClick={() => onTagClick && onTagClick(selectedTag)} className="text-[10px] text-red-400 hover:text-red-600 font-bold uppercase">Clear</button>
            )}
        </div>
        <div className="flex flex-wrap gap-y-2 gap-x-3">
          {tags.length > 0 ? (
            tags.map((tag, idx) => (
              <button 
                key={idx} 
                onClick={() => onTagClick && onTagClick(tag)}
                className={`font-open-sans font-bold text-sm transition-colors cursor-pointer hover:text-seth-yellow ${selectedTag === tag ? 'text-seth-yellow underline' : 'text-gray-500'}`}
              >
                #{tag}
              </button>
            ))
          ) : (
            <span className="font-open-sans font-medium text-sm text-gray-400 italic">No tags yet.</span>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-400 font-bold mt-auto pt-8 border-t border-gray-200 font-open-sans">
        &copy; {new Date().getFullYear()} Harun Aksaya
      </div>
    </div>
  );
};

interface PostListProps {
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, onSelectPost }) => {
  return (
    <div className="space-y-16">
      {posts.map((post) => (
        <article key={post.id} className="group">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 font-open-sans">
            {format(new Date(post.date), 'MMMM d, yyyy')}
          </div>
          <h2 
            onClick={() => onSelectPost(post)}
            className="text-3xl md:text-[2.5rem] font-extrabold text-[#3a3a3a] cursor-pointer hover:text-seth-yellow transition-colors mb-5 leading-tight font-open-sans tracking-tight"
          >
            {post.title}
          </h2>
          <div className="text-[#666666] leading-relaxed mb-4 font-open-sans font-normal text-[18px]">
             {post.content.replace(/[#*`]/g, '').substring(0, 180)}...
          </div>
          <div 
            onClick={() => onSelectPost(post)}
            className="inline-flex items-center text-seth-yellow font-bold text-xs uppercase tracking-widest cursor-pointer hover:underline font-open-sans mt-2"
          >
            Read More <ArrowRight size={14} className="ml-1" />
          </div>
        </article>
      ))}
    </div>
  );
};

interface PostDetailProps {
  post: BlogPost;
  onBack: () => void;
  onTagClick?: (tag: string) => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ post, onBack, onTagClick }) => {
  const [viewCount, setViewCount] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const count = incrementStoredViewCount(post.id);
    setViewCount(count);
  }, [post.id]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = post.title;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="animate-fade-in max-w-2xl mx-auto md:mx-0">
      <button 
        onClick={onBack}
        className="mb-8 text-gray-400 hover:text-seth-yellow flex items-center text-xs font-open-sans font-bold uppercase tracking-widest transition-colors"
      >
        <ArrowLeft size={16} className="mr-2" /> All Posts
      </button>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#3a3a3a] leading-tight font-open-sans tracking-tight mb-4">
          {post.title}
        </h1>
         <div className="flex items-center space-x-4 text-xs font-bold text-gray-400 uppercase tracking-widest font-open-sans">
            <span>{format(new Date(post.date), 'MMMM d, yyyy')}</span>
            <span className="flex items-center" title={`${viewCount} views`}>
              <Eye size={14} className="mr-1" />
              {viewCount > 0 ? viewCount.toLocaleString() : '...'}
            </span>
          </div>
      </header>

      <div className="mb-8">
        <MarkdownRenderer content={post.content} />
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-3">
          {post.tags.map((tag, index) => (
            <button 
              key={index}
              onClick={() => onTagClick && onTagClick(tag)}
              className="text-sm font-bold font-open-sans text-seth-yellow hover:text-seth-hover cursor-pointer transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      <div className="border-t border-gray-200 pt-8 mt-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="text-sm text-gray-500 italic font-open-sans">
          Posted by {post.author}
        </div>
        
        <div className="flex items-center space-x-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Share</span>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-seth-yellow transition-colors"><Twitter size={18} /></a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-seth-yellow transition-colors"><Linkedin size={18} /></a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-seth-yellow transition-colors"><Facebook size={18} /></a>
            <button onClick={handleCopyLink} className={`transition-colors ${copied ? 'text-green-500' : 'text-gray-400 hover:text-seth-yellow'}`}>{copied ? <Check size={18} /> : <LinkIcon size={18} />}</button>
        </div>
      </div>
    </article>
  );
};

// --- MAIN APP ---

function App() {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showGenerator, setShowGenerator] = useState(false);
  const [generatorConfig, setGeneratorConfig] = useState<GeneratorConfig>({ topic: '', isGenerating: false });

  useEffect(() => {
    initGA();
    logPageView('Home', '/');
  }, []);

  useEffect(() => {
    if (selectedPost) {
      logPageView(selectedPost.title, `/post/${selectedPost.id}`);
    } else {
      logPageView(selectedTag ? `Tag: ${selectedTag}` : 'Home', '/');
    }
  }, [selectedPost, selectedTag]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(post => {
      if (post.tags) post.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (selectedTag) {
      result = result.filter(post => post.tags && post.tags.includes(selectedTag));
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.content.toLowerCase().includes(query)
      );
    }
    return result;
  }, [posts, selectedTag, searchQuery]);

  const handleTagSelect = (tag: string) => {
    if (selectedTag === tag) {
        setSelectedTag(null);
    } else {
        setSelectedTag(tag);
        logEvent('filter_tag', 'Navigation', tag);
    }
    setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (selectedPost) setSelectedPost(null);
  };

  const handleClearFilter = () => {
      setSelectedTag(null);
      setSearchQuery('');
  };

  const handleRandomPost = () => {
    if (posts.length === 0) return;
    const randomIndex = Math.floor(Math.random() * posts.length);
    const randomPost = posts[randomIndex];
    logEvent('click_random', 'Discovery', randomPost.title);
    setSelectedTag(null);
    setSearchQuery('');
    setSelectedPost(randomPost);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreatePost = async () => {
    if (!generatorConfig.topic.trim()) return;
    setGeneratorConfig(prev => ({ ...prev, isGenerating: true }));
    try {
      const { title, content, tags } = await generateSethStylePost(generatorConfig.topic);
      const newPost: BlogPost = {
        id: Date.now().toString(),
        title,
        content,
        date: new Date().toISOString(),
        author: 'Harun Aksaya',
        tags
      };
      logEvent('generate_post', 'AI', generatorConfig.topic);
      setPosts(prev => [newPost, ...prev]);
      setShowGenerator(false);
      setGeneratorConfig({ topic: '', isGenerating: false });
      setSelectedPost(newPost);
      setSelectedTag(null);
      setSearchQuery('');
    } catch (error) {
      alert("Failed to generate post. Please check your API Key configuration.");
      setGeneratorConfig(prev => ({ ...prev, isGenerating: false }));
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#555555] font-open-sans selection:bg-seth-yellow selection:text-white flex flex-col md:flex-row">
      <aside className="w-full md:w-72 lg:w-80 flex-shrink-0 bg-gray-50 border-r border-gray-100 md:h-screen md:sticky md:top-0 overflow-y-auto">
        <Sidebar 
            tags={allTags} 
            selectedTag={selectedTag}
            onTagClick={handleTagSelect}
            onRandomPostClick={handleRandomPost}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
        />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 relative">
         <div className="absolute top-6 right-6 z-10">
            <button 
                onClick={() => setShowGenerator(true)}
                className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-seth-yellow hover:text-white text-gray-600 rounded-full transition-all duration-300 shadow-sm"
                title="New Idea"
            >
                <PlusCircle size={20} />
            </button>
        </div>

        <main className="flex-1 px-6 md:px-12 pt-12 md:pt-16 pb-20 max-w-4xl">
          {selectedPost ? (
            <PostDetail post={selectedPost} onBack={() => setSelectedPost(null)} onTagClick={handleTagSelect} />
          ) : (
            <>
                {(selectedTag || searchQuery) && (
                    <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between bg-gray-50 p-4 rounded-sm border-l-4 border-seth-yellow animate-in fade-in slide-in-from-top-2 gap-3">
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <span className="text-gray-500 font-open-sans text-sm">Showing results for:</span>
                            <div className="flex flex-wrap gap-2">
                              {selectedTag && <span className="font-bold text-[#3a3a3a] text-lg">#{selectedTag}</span>}
                              {searchQuery && <span className="font-bold text-[#3a3a3a] text-lg">"{searchQuery}"</span>}
                            </div>
                            <span className="md:ml-2 text-xs font-bold text-gray-400 bg-white px-2 py-1 rounded-full shadow-sm w-fit">
                                {filteredPosts.length} posts
                            </span>
                        </div>
                        <button onClick={handleClearFilter} className="flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors">
                            <FilterX size={14} className="mr-1" /> Clear Filters
                        </button>
                    </div>
                )}
                
                {filteredPosts.length > 0 ? (
                    <PostList posts={filteredPosts} onSelectPost={setSelectedPost} />
                ) : (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4 text-gray-400">
                          <Search size={32} />
                        </div>
                        <p className="text-xl font-bold text-gray-300">No posts found.</p>
                        <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
                        <button onClick={handleClearFilter} className="mt-6 text-seth-yellow hover:underline font-bold">Clear all filters</button>
                    </div>
                )}
            </>
          )}
        </main>
      </div>

      {showGenerator && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg border-2 border-gray-100 shadow-2xl p-8 relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowGenerator(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
            <div className="text-center mb-8">
               <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 text-seth-yellow rounded-full mb-4"><Sparkles size={24} /></div>
               <h2 className="text-2xl font-extrabold font-open-sans tracking-tight text-[#2d2d2d]">Generate a Post</h2>
               <p className="text-gray-500 mt-2 text-sm font-open-sans">Enter a topic, and AI will write a punchy, insightful post about it.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 font-open-sans uppercase tracking-widest">Topic or Idea</label>
                <input
                  type="text"
                  value={generatorConfig.topic}
                  onChange={(e) => setGeneratorConfig({ ...generatorConfig, topic: e.target.value })}
                  placeholder="e.g. Writer's Block, Shipping, The Lizard Brain"
                  className="w-full border-b-2 border-gray-200 px-2 py-3 focus:border-seth-yellow focus:outline-none transition-colors font-open-sans text-lg bg-transparent text-[#2d2d2d]"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleCreatePost()}
                />
              </div>
              <button
                onClick={handleCreatePost}
                disabled={generatorConfig.isGenerating || !generatorConfig.topic.trim()}
                className="w-full bg-seth-yellow hover:bg-seth-hover text-white font-bold py-4 mt-4 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-open-sans uppercase tracking-widest text-sm"
              >
                {generatorConfig.isGenerating ? (
                  <> <Loader2 className="animate-spin" size={20} /> <span>Thinking...</span> </>
                ) : (
                  <> <Sparkles size={20} /> <span>Generate Post</span> </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element to mount to");
const root = ReactDOM.createRoot(rootElement);
root.render(<React.StrictMode><App /></React.StrictMode>);