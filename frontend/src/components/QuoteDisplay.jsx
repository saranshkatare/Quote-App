import React from 'react';
import { Quote as QuoteIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuoteDisplay({ quote, loading, fetchingNext, palette }) {
  return (
    <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-4 py-8">
      {/* Homepage Main Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8 sm:mb-12 flex flex-col items-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card mb-3 border border-white/5 shadow-inner">
          <Sparkles className={`w-3.5 h-3.5 ${palette.accentText} animate-pulse`} />
          <span className="text-[11px] font-mono tracking-widest text-slate-300 uppercase">
            Timeless Wisdom & Dohes
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent drop-shadow-sm">
          Life ke Dohe , Khatri ke Pohe
        </h1>
      </motion.div>

      {/* Quote Display Area */}
      <div className="relative w-full min-h-[220px] sm:min-h-[260px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {loading || fetchingNext ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <div className={`w-10 h-10 border-2 ${palette.buttonBorder} border-t-transparent rounded-full animate-spin`} />
              <p className="text-xs font-mono text-slate-400 tracking-wider">Unfolding Wisdom...</p>
            </motion.div>
          ) : quote ? (
            <motion.div
              key={quote.id}
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -15 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-full relative px-6 sm:px-12 py-8 rounded-3xl glass-panel shadow-2xl shadow-black/60 border border-white/10"
            >
              {/* Decorative Quote Icon Background */}
              <QuoteIcon className={`absolute top-4 left-6 w-16 h-16 sm:w-24 sm:h-24 ${palette.quoteMarkColor} pointer-events-none select-none`} />

              {/* Quote Text */}
              <blockquote className="relative z-10 text-xl sm:text-3xl md:text-4xl font-serif leading-relaxed sm:leading-relaxed text-slate-100 tracking-tight font-medium max-w-3xl mx-auto">
                "{quote.text}"
              </blockquote>

              {/* Quote Author & Category */}
              <div className="relative z-10 mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <p className={`text-base sm:text-lg font-medium font-sans ${palette.accentText} tracking-wide`}>
                  — {quote.author || 'Anonymous'}
                </p>

                {quote.category && (
                  <span className={`px-3 py-1 text-xs font-mono rounded-full border ${palette.badgeBg} uppercase tracking-wider font-semibold`}>
                    {quote.category}
                  </span>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="text-slate-400 font-sans text-sm">No quotes available. Add one to get started!</div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
