import React, { useEffect, useState } from 'react';
import { BlogPost } from '../types.ts';
import { format } from 'date-fns';
import { MarkdownRenderer } from './MarkdownRenderer.tsx';
import { ArrowLeft, Eye, Twitter, Linkedin, Facebook, Link as LinkIcon, Check } from 'lucide-react';
import { incrementStoredViewCount } from '../services/viewService.ts';

interface PostDetailProps {
  post: BlogPost;
  onBack: () => void;
  onTagClick?: (tag: string) => void;
}

export const PostDetail: React.FC<PostDetailProps> = ({ post, onBack, onTagClick }) => {
  const [viewCount, setViewCount] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // This increments the "simulated" local view count for visual flair.
    // Real analytics are handled in the background by GA4 (App.tsx).
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
            
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-seth-yellow transition-colors"
              title="Share on Twitter"
            >
              <Twitter size={18} />
            </a>

            <a 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-seth-yellow transition-colors"
              title="Share on LinkedIn"
            >
              <Linkedin size={18} />
            </a>

            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-seth-yellow transition-colors"
              title="Share on Facebook"
            >
              <Facebook size={18} />
            </a>

            <button 
              onClick={handleCopyLink}
              className={`transition-colors ${copied ? 'text-green-500' : 'text-gray-400 hover:text-seth-yellow'}`}
              title="Copy Link"
            >
              {copied ? <Check size={18} /> : <LinkIcon size={18} />}
            </button>
        </div>
      </div>
    </article>
  );
};