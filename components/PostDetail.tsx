import React from 'react';
import { BlogPost } from '../types';
import { format } from 'date-fns';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Share2, ArrowLeft } from 'lucide-react';

interface PostDetailProps {
  post: BlogPost;
  onBack: () => void;
}

export const PostDetail: React.FC<PostDetailProps> = ({ post, onBack }) => {
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
         <div className="text-xs font-bold text-gray-400 uppercase tracking-widest font-open-sans">
            {format(new Date(post.date), 'MMMM d, yyyy')}
          </div>
      </header>

      <div className="mb-8">
        <MarkdownRenderer content={post.content} />
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-3">
          {post.tags.map((tag, index) => (
            <span 
              key={index} 
              className="text-sm font-bold font-open-sans text-seth-yellow hover:text-seth-hover cursor-pointer transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="border-t border-gray-200 pt-6 flex justify-between items-center">
        <div className="text-sm text-gray-500 italic font-open-sans">
          Posted by {post.author}
        </div>
        <button className="text-gray-400 hover:text-seth-yellow transition-colors">
          <Share2 size={20} />
        </button>
      </div>
    </article>
  );
};