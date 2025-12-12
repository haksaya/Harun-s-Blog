import React from 'react';
import { html } from 'htm/react';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';

export const PostList = ({ posts, onSelectPost }) => {
  return html`
    <div className="space-y-16">
      ${posts.map((post) => html`
        <article key=${post.id} className="group">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 font-open-sans">
            ${format(new Date(post.date), 'MMMM d, yyyy')}
          </div>
          <h2 
            onClick=${() => onSelectPost(post)}
            className="text-3xl md:text-[2.5rem] font-extrabold text-[#3a3a3a] cursor-pointer hover:text-seth-yellow transition-colors mb-5 leading-tight font-open-sans tracking-tight"
          >
            ${post.title}
          </h2>
          <div className="text-[#666666] leading-relaxed mb-4 font-open-sans font-normal text-[18px]">
             ${post.content.replace(/[#*`]/g, '').substring(0, 180)}...
          </div>
          <div 
            onClick=${() => onSelectPost(post)}
            className="inline-flex items-center text-seth-yellow font-bold text-xs uppercase tracking-widest cursor-pointer hover:underline font-open-sans mt-2"
          >
            Read More <${ArrowRight} size=${14} className="ml-1" />
          </div>
        </article>
      `)}
    </div>
  `;
};