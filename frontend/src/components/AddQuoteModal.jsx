import React, { useState } from 'react';
import { X, Plus, Send, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SUGGESTED_CATEGORIES = ['हिंदी दोहे', 'संस्कृत श्लोक', 'Life', 'Minimalism', 'Inspiration', 'Urdu Shayari'];

export default function AddQuoteModal({ isOpen, onClose, onAddQuote, palette }) {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Dohe');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setErrorMsg('Please enter a quote text.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const res = await onAddQuote({
      text: text.trim(),
      author: author.trim() || 'Anonymous',
      category: category.trim() || 'Dohe'
    });

    setSubmitting(false);

    if (res.success) {
      setText('');
      setAuthor('');
      setCategory('Dohe');
      onClose();
    } else {
      setErrorMsg(res.error || 'Failed to submit quote.');
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

          {/* Modal Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10 z-10 my-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${palette.accentText}`}>
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold text-white">Add New Quote or Dohe</h2>
                  <p className="text-xs font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Globe className="w-3 h-3 text-slate-400" />
                    <span>Supports all languages (Hindi, English, Sanskrit, etc.)</span>
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full glass-card text-slate-400 hover:text-white transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono">
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                  Quote / Dohe Text <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter quote in any language (e.g. दुख में सुमिरन सब करे, Pothi padhi padhi...)"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full p-3.5 rounded-2xl glass-card border border-white/10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-white/30 transition-colors resize-none font-serif leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. कबीर दास, Kabir Das, Khatri Ji"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-card border border-white/10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. हिंदी दोहे, Dohe, Life"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-card border border-white/10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
              </div>

              {/* Quick Category Tags */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mr-1">Suggestions:</span>
                {SUGGESTED_CATEGORIES.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setCategory(tag)}
                    className="px-2.5 py-0.5 rounded-full bg-white/5 hover:bg-white/15 text-[11px] font-mono text-slate-300 transition-colors border border-white/5"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-sans font-medium text-sm transition-all duration-200 ${palette.buttonBg} shadow-lg disabled:opacity-50`}
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Submitting...' : 'Save Quote'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
