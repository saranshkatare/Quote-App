import React, { useState, useMemo } from 'react';
import { X, Search, Copy, Check, Trash2, Pencil, Sparkles, Heart, Flame, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuoteListModal({
  isOpen,
  onClose,
  quotesList,
  onDeleteQuote,
  onEditQuote,
  onLikeQuote,
  likedQuoteIds,
  onPlayTTS,
  palette
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('likes'); // 'likes' or 'newest'
  const [copiedId, setCopiedId] = useState(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(quotesList.map(q => q.category).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [quotesList]);

  // Filtered & Sorted quotes list
  const processedQuotes = useMemo(() => {
    let result = quotesList.filter(quote => {
      const matchesSearch = 
        quote.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (quote.author && quote.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (quote.category && quote.category.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'ALL' || quote.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'likes') {
      result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return result;
  }, [quotesList, searchTerm, selectedCategory, sortBy]);

  const handleCopy = (quote) => {
    const textToCopy = `"${quote.text}" — ${quote.author}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(quote.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (e, quoteId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this quote?')) {
      onDeleteQuote(quoteId);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-3xl glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 z-10 my-8 max-h-[85vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-5">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl bg-white/5 border border-white/10 ${palette.accentText}`}>
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">All Quotes Collection</h2>
                  <p className="text-xs font-mono text-slate-400">Total {quotesList.length} dohes & quotes saved</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full glass-card text-slate-400 hover:text-white transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Sorting Controls */}
            <div className="space-y-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search quote, author, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-card border border-white/10 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>

                {/* Sort Toggle Buttons */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl glass-card border border-white/10 self-start sm:self-auto">
                  <button
                    onClick={() => setSortBy('likes')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-colors ${sortBy === 'likes' ? `${palette.buttonBg} font-semibold` : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Most Liked</span>
                  </button>
                  <button
                    onClick={() => setSortBy('newest')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-colors ${sortBy === 'newest' ? `${palette.buttonBg} font-semibold` : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Newest
                  </button>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-mono tracking-wider transition-all duration-200 whitespace-nowrap ${
                      selectedCategory === cat 
                        ? `${palette.buttonBg} font-semibold shadow-md` 
                        : 'glass-card text-slate-300 hover:text-white border border-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Quotes List Scroll Area */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
              {processedQuotes.length === 0 ? (
                <div className="text-center py-12 text-slate-400 font-sans text-sm">
                  No quotes found matching your search criteria.
                </div>
              ) : (
                processedQuotes.map((quote) => {
                  const isLiked = likedQuoteIds.includes(quote.id);
                  return (
                    <div
                      key={quote.id}
                      className="group relative p-5 rounded-2xl glass-card border border-white/5 hover:border-white/15 transition-all duration-200"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <blockquote className="text-slate-200 font-serif text-base leading-relaxed">
                            "{quote.text}"
                          </blockquote>
                          <div className="flex items-center gap-2 pt-1">
                            <span className={`text-xs font-medium ${palette.accentText}`}>
                              — {quote.author || 'Anonymous'}
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                              {quote.category || 'General'}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                          {/* Like Button */}
                          <button
                            onClick={() => onLikeQuote(quote.id)}
                            title="Like Quote"
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-colors ${isLiked ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'}`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                            <span>{quote.likes || 0}</span>
                          </button>

                          {/* TTS Play Button */}
                          <button
                            onClick={() => onPlayTTS(quote)}
                            title="Listen Poet Voice"
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => onEditQuote(quote)}
                            title="Edit Quote"
                            className="p-2 rounded-xl bg-white/5 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          {/* Copy Button */}
                          <button
                            onClick={() => handleCopy(quote)}
                            title="Copy Quote"
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                          >
                            {copiedId === quote.id ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={(e) => handleDelete(e, quote.id)}
                            title="Delete Quote"
                            className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
