'use client';

import { useState, useEffect, useRef } from 'react';
import ActionTiles from './components/ActionTiles';
import CardStack from './components/CardStack';
import JournalDrawer from './components/JournalDrawer';
import { motion, AnimatePresence } from 'framer-motion';

type Reflection = {
  query: string;
  answer: string;
  reference: string;
  topic: string;
  prayer: string;
  verseText: string;
  timestamp: number;
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<'search' | 'reflections'>('search');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showInsight, setShowInsight] = useState(false);
  const [showPrayer, setShowPrayer] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(newHeight, 160)}px`;
      
      // Hide scrollbar if content is less than max height
      if (newHeight <= 160) {
        textareaRef.current.style.overflowY = 'hidden';
      } else {
        textareaRef.current.style.overflowY = 'auto';
      }
    }
  }, [query]);

  useEffect(() => {
    const saved = localStorage.getItem('reflections');
    if (saved) {
      setReflections(JSON.parse(saved));
    }
    
    // Automatically switch based on system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const setTheme = (isDark: boolean) => {
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    };
    
    setTheme(mediaQuery.matches);
    mediaQuery.addEventListener('change', (e) => setTheme(e.matches));
  }, []);

  useEffect(() => {
    if (result) {
      const saved = reflections.some(r => r.query === result.query && r.reference === result.reference);
      setIsSaved(saved);
    }
  }, [result, reflections]);

  const toggleReflection = (data: any) => {
    const isCurrentlySaved = reflections.some(r => r.query === data.query && r.reference === data.reference);
    
    if (isCurrentlySaved) {
      const updated = reflections.filter(r => !(r.query === data.query && r.reference === data.reference));
      setReflections(updated);
      localStorage.setItem('reflections', JSON.stringify(updated));
      setIsSaved(false);
    } else {
      const newEntry = { ...data, timestamp: Date.now() };
      const updated = [newEntry, ...reflections];
      setReflections(updated);
      localStorage.setItem('reflections', JSON.stringify(updated));
      setIsSaved(true);
    }
  };

  const deleteReflection = (timestamp: number) => {
    const updated = reflections.filter(r => r.timestamp !== timestamp);
    setReflections(updated);
    localStorage.setItem('reflections', JSON.stringify(updated));
  };

  const handleSelectReflection = (reflection: Reflection) => {
    setResult(reflection);
    setSubmittedQuery(reflection.query);
    setQuery('');
    setIsDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = async (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (!finalQuery) return;
    
    setLoading(true);
    setResult(null);
    setShowInsight(false);
    setShowPrayer(false);
    setQuery('');
    setSubmittedQuery(finalQuery);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: finalQuery }),
      });
      const data = await response.json();
      
      setResult({ ...data, query: finalQuery });
    } catch (error) {
      setResult({ error: 'Failed to find wisdom. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-4 md:p-8 font-sans transition-colors duration-300">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-serif tracking-tight opacity-90">The Cornerstone</h1>
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="text-sm font-medium opacity-60 hover:opacity-100"
        >
          My Journal
        </button>
      </header>

      <main className="max-w-xl mx-auto space-y-6">
        <form 
          onSubmit={(e) => { 
            e.preventDefault(); 
            handleSearch(); 
          }} 
          className="relative group"
        >
          <motion.div
            layout
            initial={false}
            className="w-full"
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={query}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              onChange={(e) => {
                setQuery(e.target.value);
                if (result) setResult(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              placeholder="Ask for guidance..."
              className="w-full p-4 pl-5 pr-14 rounded-[26px] border border-black/5 bg-[var(--card-bg)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all resize-none block leading-relaxed overflow-hidden"
              style={{ 
                minHeight: '56px',
                maxHeight: '160px',
              }}
            />
          </motion.div>
          <AnimatePresence>
            {query.trim() && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="submit"
                className="absolute right-2 bottom-2 p-2 bg-[#4A5D4E] text-white rounded-full hover:bg-[#3D4D3E] transition-colors shadow-sm active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </form>

        {(isFocused || !result) && !loading && <ActionTiles onSearch={handleSearch} />}

        {submittedQuery && (
          <div className="text-center pb-2">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--card-bg)] text-xs opacity-60 font-medium border border-black/5 shadow-sm">
              {submittedQuery}
            </span>
          </div>
        )}

        {loading && <div className="text-center py-10 opacity-60">Reflecting on your request...</div>}

        {result && !loading && (
          <CardStack>
            {result.status === 'rejected' ? (
              <div className="text-center py-6">
                <p className="text-[#7F8C8D] italic font-serif leading-relaxed px-4 opacity-80">
                  {result.answer}
                </p>
              </div>
            ) : result.error ? (
              <p className="text-center opacity-60">{result.error}</p>
            ) : (
              <div className="space-y-4">
                <blockquote className="text-lg font-serif italic leading-relaxed">
                  “{result.verseText}”
                </blockquote>
                
                {/* Scripture Footer with Save & Share Icons */}
                <div className="flex justify-between items-center pt-2">
                    <cite className="text-[#A68A64] font-medium uppercase text-xs tracking-wider block">— {result.reference}</cite>
                    <div className="flex gap-3">
                      <button 
                          onClick={async () => {
                            const text = `The Cornerstone | ${result.reference} \n\n ${result.verseText} \n\n (Shared via The Cornerstone)`;
                            if (navigator.share) {
                              try {
                                await navigator.share({
                                  title: 'The Cornerstone',
                                  text: text,
                                });
                              } catch (err) {
                                console.error('Share failed:', err);
                              }
                            } else if (typeof window !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
                              try {
                                await navigator.clipboard.writeText(text);
                                alert('Scripture copied to clipboard!');
                              } catch (err) {
                                console.error('Clipboard failed:', err);
                                alert('Failed to copy to clipboard.');
                              }
                            } else {
                              alert('Sharing is not supported on this browser.');
                            }
                          }}
                          className="opacity-50 hover:opacity-100 transition-colors"
                          aria-label="Share Scripture"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-1.342A3 3 0 0016 9.5zm0 9.5a3 3 0 100-6 3 3 0 000 6z" />
                        </svg>
                      </button>
                      <button 
                          onClick={() => toggleReflection(result)}
                          className={`transition-colors ${isSaved ? 'text-[#D4AF37]' : 'opacity-50 hover:opacity-100'}`}
                          aria-label="Toggle Save Reflection"
                      >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                      </button>
                    </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <button 
                    onClick={() => setShowInsight(!showInsight)}
                    className="flex-1 py-2 text-xs bg-[var(--card-bg)] border border-black/5 rounded-lg hover:opacity-80"
                  >
                    {showInsight ? 'Hide Insight' : 'Insight'}
                  </button>
                  <button 
                    onClick={() => setShowPrayer(!showPrayer)}
                    className="flex-1 py-2 text-xs bg-[var(--card-bg)] border border-black/5 rounded-lg hover:opacity-80"
                  >
                    {showPrayer ? 'Hide Prayer' : 'Prayer'}
                  </button>
                </div>

                {showInsight && (
                  <p className="text-sm leading-relaxed pt-2">
                    <span className="font-bold opacity-90">Insight:</span> {result.answer}
                  </p>
                )}

                {showPrayer && (
                  <p className="text-sm leading-relaxed pt-2 border-t border-black/5">
                    <span className="font-bold opacity-90">Prayer:</span> {result.prayer}
                  </p>
                )}
              </div>
            )}
          </CardStack>
        )}
      </main>

      <JournalDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        reflections={reflections} 
        onDelete={deleteReflection}
        onSelect={handleSelectReflection}
      />
    </div>
  );
}
