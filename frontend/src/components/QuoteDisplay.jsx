import React, { useState } from 'react';
import { Quote as QuoteIcon, Sparkles, Heart, Volume2, VolumeX, Share2, Flame, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuoteDisplay({
  quote,
  loading,
  fetchingNext,
  palette,
  onLikeQuote,
  isLiked,
  onPlayTTS,
  onStopTTS,
  isPlayingTTS,
  ttsLoading,
  onShareQuote
}) {
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [shareSuccessMsg, setShareSuccessMsg] = useState('');

  const handleLikeClick = async () => {
    if (!quote) return;
    setLikeAnimating(true);
    await onLikeQuote(quote.id);
    setTimeout(() => setLikeAnimating(false), 600);
  };

  const handleShareClick = async () => {
    if (!quote) return;
    const res = await onShareQuote(quote);
    if (res?.copied) {
      setShareSuccessMsg('Copied to Clipboard!');
      setTimeout(() => setShareSuccessMsg(''), 2500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-4 py-6">
      {/* Homepage Main Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-6 sm:mb-10 flex flex-col items-center"
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

      {/* Quote Display Card */}
      <div className="relative w-full min-h-[240px] sm:min-h-[280px] flex items-center justify-center">
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
              {/* Featured / Most Liked Badge */}
              {quote.likes >= 20 && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-mono text-[10px] uppercase font-bold tracking-wider shadow-lg shadow-amber-500/20">
                  <Flame className="w-3 h-3 fill-slate-950" />
                  <span>Featured Dohe</span>
                </div>
              )}

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

              {/* Interactive Toolbar: Deep Poet TTS 🔊, Like ❤️, Share 📲 */}
              <div className="relative z-10 mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-4 sm:gap-6">
                
                {/* Deep Poet TTS Button */}
                <button
                  onClick={() => isPlayingTTS ? onStopTTS() : onPlayTTS(quote)}
                  title={isPlayingTTS ? "Stop Narration" : "Listen in Deep Poet Voice"}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/10 hover:border-white/20 transition-all duration-200 text-xs font-mono tracking-wider ${isPlayingTTS ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' : 'text-slate-300 hover:text-white'}`}
                >
                  {ttsLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  ) : isPlayingTTS ? (
                    <>
                      <VolumeX className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold animate-pulse">Playing Poet TTS...</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className={`w-4 h-4 ${palette.accentText}`} />
                      <span>Poet TTS</span>
                    </>
                  )}
                </button>

                {/* Like Button */}
                <button
                  onClick={handleLikeClick}
                  title="Like Quote"
                  className={`group relative flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/10 hover:border-white/20 transition-all duration-200 text-xs font-mono tracking-wider ${isLiked ? 'text-rose-400 border-rose-500/40 bg-rose-500/10' : 'text-slate-300 hover:text-white'}`}
                >
                  <motion.div
                    animate={likeAnimating ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart className={`w-4 h-4 transition-colors ${isLiked ? 'fill-rose-500 text-rose-500' : 'group-hover:text-rose-400'}`} />
                  </motion.div>
                  <span className="font-semibold">{quote.likes || 0}</span>
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShareClick}
                  title="Share Quote"
                  className="flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all duration-200 text-xs font-mono tracking-wider"
                >
                  <Share2 className={`w-4 h-4 ${palette.accentText}`} />
                  <span>Share</span>
                </button>
              </div>

              {/* Toast Message for Copy */}
              <AnimatePresence>
                {shareSuccessMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono flex items-center gap-1.5"
                  >
                    <Check className="w-3 h-3" />
                    <span>{shareSuccessMsg}</span>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          ) : (
            <div className="text-slate-400 font-sans text-sm">No quotes available. Add one to get started!</div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
