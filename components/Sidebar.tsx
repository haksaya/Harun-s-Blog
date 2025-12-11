import React, { useState } from 'react';
import { Mail, Search, Github, Linkedin, Twitter, Instagram, GraduationCap, Loader2, Check } from 'lucide-react';

interface SidebarProps {
  tags: string[];
}

export const Sidebar: React.FC<SidebarProps> = ({ tags }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      setEmail('');
    }, 1000);
  };

  return (
    <div className="p-8 md:p-10 h-full flex flex-col font-open-sans">
      <div className="mb-10 text-center">
        <img 
          src="https://harunaksaya.github.io/assets/images/photos/haksaya.jpg" 
          alt="Harun Aksaya" 
          className="w-36 h-36 rounded-full mx-auto mb-6 object-cover border-4 border-seth-yellow shadow-sm"
        />
        
        {/* Social Icons */}
        <div className="flex justify-center items-center space-x-3 mb-8">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-seth-yellow transition-colors transform hover:scale-110" title="GitHub">
                <Github size={20} />
            </a>
            <a href="https://scholar.google.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-seth-yellow transition-colors transform hover:scale-110" title="Google Academic">
                <GraduationCap size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-seth-yellow transition-colors transform hover:scale-110" title="LinkedIn">
                <Linkedin size={20} />
            </a>
            <a href="mailto:email@example.com" className="text-gray-400 hover:text-seth-yellow transition-colors transform hover:scale-110" title="Email">
                <Mail size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-seth-yellow transition-colors transform hover:scale-110" title="Twitter / X">
                <Twitter size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-seth-yellow transition-colors transform hover:scale-110" title="Instagram">
                <Instagram size={20} />
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
          <div className="flex items-center space-x-2 text-green-600 animate-in fade-in slide-in-from-left-2 duration-300">
            <Check size={16} />
            <span className="font-open-sans font-bold text-sm">Thanks for subscribing!</span>
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
            placeholder="Type to search..." 
            className="font-open-sans font-semibold w-full border-b-2 border-gray-200 py-2 text-sm focus:outline-none focus:border-seth-yellow transition-colors bg-transparent text-[#3a3a3a] placeholder-gray-400"
          />
          <Search size={18} className="absolute right-0 top-2 text-gray-400" />
        </div>
      </div>

       <div className="mb-10 flex-1">
        <h3 className="font-open-sans font-extrabold text-xs uppercase tracking-widest text-[#3a3a3a] mb-4">Tags</h3>
        <div className="flex flex-wrap gap-y-2 gap-x-3">
          {tags.length > 0 ? (
            tags.map((tag, idx) => (
              <span 
                key={idx} 
                className="font-open-sans font-bold text-sm text-gray-500 hover:text-seth-yellow transition-colors cursor-pointer"
              >
                #{tag}
              </span>
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