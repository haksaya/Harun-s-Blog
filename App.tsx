import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { PostList } from './components/PostList';
import { PostDetail } from './components/PostDetail';
import { BlogPost, GeneratorConfig } from './types';
import { INITIAL_POSTS } from './constants';
import { generateSethStylePost } from './services/geminiService';
import { Sparkles, X, Loader2, PlusCircle } from 'lucide-react';

export default function App() {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [generatorConfig, setGeneratorConfig] = useState<GeneratorConfig>({
    topic: '',
    isGenerating: false,
  });

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

      setPosts(prev => [newPost, ...prev]);
      setShowGenerator(false);
      setGeneratorConfig({ topic: '', isGenerating: false });
      setSelectedPost(newPost); // Auto open new post
    } catch (error) {
      alert("Failed to generate post. Please check your API Key.");
      setGeneratorConfig(prev => ({ ...prev, isGenerating: false }));
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#555555] font-open-sans selection:bg-seth-yellow selection:text-white flex flex-col md:flex-row">
      
      {/* Left Column: Sidebar (Sticky on Desktop) */}
      <aside className="w-full md:w-72 lg:w-80 flex-shrink-0 bg-gray-50 border-r border-gray-100 md:h-screen md:sticky md:top-0 overflow-y-auto">
        <Sidebar tags={allTags} />
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
            />
          ) : (
            <PostList 
              posts={posts} 
              onSelectPost={setSelectedPost} 
            />
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