import React, { useState, useMemo } from 'react';
import { X, Search, Copy, Check, Trash2, Quote as QuoteIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuoteListModal({ isOpen, onClose, quotesList, onDeleteQuote, palette }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(quotesList.map(q => q.category).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [quotesList]);

  // Filtered quotes list
  const filteredQuotes = useMemo(() => {
    return quotesList.filter(quote => {
      const matchesSearch = 
        quote.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (quote.author && quote.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (quote.category && quote.category.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'ALL' || quote.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [quotesList, searchTerm, selectedCategory]);

  const handleCopy = (quote) => {
    const textToCopy = `"${quote.text}" — ${quote.author}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(quote.id);
    setTimeout(() => setCopiedId(null), 2000);
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

            {/* Search & Category Filter Bar */}
            <div className="space-y-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search quote, author, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-card border border-white/10 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-white/30 transition-colors"
                />
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
              {filteredQuotes.length === 0 ? (
                <div className="text-center py-12 text-slate-400 font-sans text-sm">
                  No quotes found matching your search criteria.
                </div>
              ) : (
                filteredQuotes.map((quote) => (
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
                      <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
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
                        <button
                          onClick={() => onDeleteQuote(quote.id)}
                          title="Delete Quote"
                          className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
