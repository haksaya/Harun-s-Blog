import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { PostList } from './components/PostList';
import { PostDetail } from './components/PostDetail';
import { BlogPost, GeneratorConfig } from './types';
import { INITIAL_POSTS } from './constants';
import { generateSethStylePost } from './services/geminiService';
import { initGA, logPageView, logEvent } from './services/analytics';
import { Sparkles, X, Loader2, PlusCircle, FilterX, Search } from 'lucide-react';

export default function App() {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(''); // Search State
  const [showGenerator, setShowGenerator] = useState(false);
  const [generatorConfig, setGeneratorConfig] = useState<GeneratorConfig>({
    topic: '',
    isGenerating: false,
  });

  // Initialize Analytics on Mount
  useEffect(() => {
    initGA();
    logPageView('Home', '/');
  }, []);

  // Track Page Views when navigation changes
  useEffect(() => {
    if (selectedPost) {
      logPageView(selectedPost.title, `/post/${selectedPost.id}`);
    } else {
      logPageView(selectedTag ? `Tag: ${selectedTag}` : 'Home', '/');
    }
  }, [selectedPost, selectedTag]);

  // Extract unique tags from all posts
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [posts]);

  // Filter posts based on selected tag AND search query
  const filteredPosts = useMemo(() => {
    let result = posts;

    // 1. Filter by Tag
    if (selectedTag) {
      result = result.filter(post => post.tags && post.tags.includes(selectedTag));
    }

    // 2. Filter by Search Query (Title or Content)
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
        setSelectedTag(null); // Toggle off if clicking the same tag
    } else {
        setSelectedTag(tag);
        logEvent('filter_tag', 'Navigation', tag);
    }
    setSelectedPost(null); // Switch back to list view to show results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (selectedPost) {
        setSelectedPost(null); // Return to list view when searching
    }
  };

  const handleClearFilter = () => {
      setSelectedTag(null);
      setSearchQuery('');
  };

  const handleRandomPost = () => {
    if (posts.length === 0) return;
    
    // Pick a random index
    const randomIndex = Math.floor(Math.random() * posts.length);
    const randomPost = posts[randomIndex];
    
    logEvent('click_random', 'Discovery', randomPost.title);

    // Clear filters and set the post
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
      setSelectedPost(newPost); // Auto open new post
      setSelectedTag(null);
      setSearchQuery('');
    } catch (error) {
      alert("Failed to generate post. Please check your API Key.");
      setGeneratorConfig(prev => ({ ...prev, isGenerating: false }));
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#555555] font-open-sans selection:bg-seth-yellow selection:text-white flex flex-col md:flex-row">
      
      {/* Left Column: Sidebar (Sticky on Desktop) */}
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

      {/* Right Column: Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Floating Generator Button (since Header was removed) */}
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
            <PostDetail 
              post={selectedPost} 
              onBack={() => setSelectedPost(null)} 
              onTagClick={handleTagSelect}
            />
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
                        <button 
                            onClick={handleClearFilter}
                            className="flex items-center text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <FilterX size={14} className="mr-1" /> Clear Filters
                        </button>
                    </div>
                )}
                
                {filteredPosts.length > 0 ? (
                    <PostList 
                    posts={filteredPosts} 
                    onSelectPost={setSelectedPost} 
                    />
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

      {/* Generator Modal */}
      {showGenerator && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg border-2 border-gray-100 shadow-2xl p-8 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowGenerator(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-8">
               <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 text-seth-yellow rounded-full mb-4">
                 <Sparkles size={24} />
               </div>
               <h2 className="text-2xl font-extrabold font-open-sans tracking-tight text-[#2d2d2d]">Generate a Post</h2>
               <p className="text-gray-500 mt-2 text-sm font-open-sans">
                 Enter a topic, and AI will write a punchy, insightful post about it.
               </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 font-open-sans uppercase tracking-widest">
                  Topic or Idea
                </label>
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
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Thinking...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>Generate Post</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}