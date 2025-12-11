import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
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