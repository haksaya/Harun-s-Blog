import React, { useState } from 'react';
import { Mail, Search, Github, Linkedin, Twitter, Instagram, GraduationCap, Loader2, Check, Shuffle, Youtube } from 'lucide-react';

interface SidebarProps {
  tags: string[];
  selectedTag?: string | null;
  onTagClick?: (tag: string) => void;
  onRandomPostClick?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Sidebar = React.memo<SidebarProps>(({ 
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
    
    // Serverless "Magic":
    // 1. We simulate the process for UI feedback.
    // 2. We trigger a mailto link so the user actually sends the request to you.
    // Alternatively, replace the form logic with Formspree.io to handle this silently.
    
    setTimeout(() => {
      // Trigger Mail Client
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
          className="w-36 h-36 rounded-full mx-auto mb-4 object-cover border-4 border-seth-yellow shadow-sm"
        />
        
        <h2 className="font-open-sans font-extrabold text-xl text-[#3a3a3a] mb-1">
          Dr. Harun AKSAYA
        </h2>
        <p className="font-open-sans text-sm text-gray-500 mb-6">
          Computer Scientist
        </p>
        
        {/* Social Icons */}
        <div className="flex justify-center items-center space-x-3 mb-8">
            <a href="https://harunaksaya.github.io" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-seth-yellow transition-colors transform hover:scale-110" title="Google Scholar">
                <GraduationCap size={20} />
            </a>
            <a href="https://github.com/haksaya" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-seth-yellow transition-colors transform hover:scale-110" title="GitHub">
                <Github size={20} />
            </a>
            <a href="https://twitter.com/harunaksaya" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-seth-yellow transition-colors transform hover:scale-110" title="Twitter / X">
                <Twitter size={20} />
            </a>
            <a href="https://instagram.com/harunaksaya" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-seth-yellow transition-colors transform hover:scale-110" title="Instagram">
                <Instagram size={20} />
            </a>
            <a href="https://linkedin.com/in/harunaksaya" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-seth-yellow transition-colors transform hover:scale-110" title="LinkedIn">
                <Linkedin size={20} />
            </a>
            <a href="https://youtube.com/@harunaksaya" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-seth-yellow transition-colors transform hover:scale-110" title="YouTube">
                <Youtube size={20} />
            </a>
            <a href="mailto:harunaksaya@gmail.com" className="text-gray-400 hover:text-seth-yellow transition-colors transform hover:scale-110" title="Email">
                <Mail size={20} />
            </a>
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
              {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
              ) : (
                  'Sign Up'
              )}
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
                <button 
                    onClick={() => onTagClick && onTagClick(selectedTag)}
                    className="text-[10px] text-red-400 hover:text-red-600 font-bold uppercase"
                >
                    Clear
                </button>
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
});