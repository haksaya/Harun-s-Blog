import { useState, useMemo, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { PostList } from './components/PostList';
import { PostDetail } from './components/PostDetail';
import { BlogPost } from './types';
import { logPageView, logEvent } from './services/analytics';
import { Loader2, FilterX, Search, AlertCircle } from 'lucide-react';
import { INITIAL_POSTS } from './constants'; 

export default function App() {
  // Load posts directly from constants.ts safely.
  // Using a try-catch block inside the initializer ensures the app renders 
  // even if there is a data issue, avoiding the "White Screen".
  const [posts] = useState<BlogPost[]>(() => {
    try {
      return INITIAL_POSTS.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (e) {
      console.error("Failed to initialize posts:", e);
      return [];
    }
  });
  
  const [loadingPosts] = useState(false);
  const [error] = useState<string | null>(null);
  
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // URL'den post ID'sini oku
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/post/')) {
        const postId = hash.replace('#/post/', '');
        const post = posts.find(p => p.id === postId);
        if (post) {
          setSelectedPost(post);
        }
      } else {
        setSelectedPost(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [posts]);

  // --- Analytics ---
  useEffect(() => {
    logPageView('Home', '/');
  }, []);

  useEffect(() => {
    if (selectedPost) {
      logPageView(selectedPost.title, `/post/${selectedPost.id}`);
    } else {
      logPageView(selectedTag ? `Tag: ${selectedTag}` : 'Home', '/');
    }
  }, [selectedPost, selectedTag]);

  // --- Filtering Logic ---
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => tags.add(tag));
      }
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

  // --- Handlers ---
  const handleTagSelect = useCallback((tag: string) => {
    if (selectedTag === tag) {
        setSelectedTag(null);
    } else {
        setSelectedTag(tag);
        logEvent('filter_tag', 'Navigation', tag);
    }
    setSelectedPost(null);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedTag]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    if (selectedPost) {
        setSelectedPost(null);
        window.location.hash = '';
    }
  }, [selectedPost]);

  const handleClearFilter = useCallback(() => {
      setSelectedTag(null);
      setSearchQuery('');
  }, []);

  const handleRandomPost = useCallback(() => {
    if (posts.length === 0) return;
    const randomIndex = Math.floor(Math.random() * posts.length);
    const randomPost = posts[randomIndex];
    logEvent('click_random', 'Discovery', randomPost.title);
    setSelectedTag(null);
    setSearchQuery('');
    window.location.hash = `#/post/${randomPost.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [posts]);



  if (loadingPosts) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white text-gray-500 font-open-sans">
            <Loader2 className="animate-spin mr-2" /> Yazılar yükleniyor...
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-500 font-open-sans p-4 text-center">
            <AlertCircle className="text-red-500 mb-4" size={48} />
            <h2 className="text-xl font-bold text-gray-700 mb-2">Bir hata oluştu</h2>
            <p className="text-sm mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-bold"
            >
              Yeniden Dene
            </button>
        </div>
    );
  }

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
        <main className="flex-1 px-6 md:px-12 pt-12 md:pt-16 pb-20 max-w-4xl">
          {selectedPost ? (
            <PostDetail 
              post={selectedPost} 
              onBack={() => {
                window.location.hash = '';
              }} 
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
                    onSelectPost={(post) => {
                      window.location.hash = `#/post/${post.id}`;
                    }} 
                    />
                ) : (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4 text-gray-400">
                          <Search size={32} />
                        </div>
                        <p className="text-xl font-bold text-gray-300">Henüz yazı bulunamadı.</p>
                        <button onClick={handleClearFilter} className="mt-6 text-seth-yellow hover:underline font-bold">Tüm filtreleri temizle</button>
                    </div>
                )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
