import React from 'react';
import { BlogPost } from '../types';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';

interface PostListProps {
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
}

export const PostList = React.memo<PostListProps>(({ posts, onSelectPost }) => {
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
             {/* Simple way to show a preview without parsing all markdown */}
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
});