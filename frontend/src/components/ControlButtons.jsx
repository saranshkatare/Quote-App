import React from 'react';
import { RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ControlButtons({ onNextQuote, fetchingNext, palette }) {
  return (
    <div className="flex flex-col items-center justify-center mt-6 sm:mt-10">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNextQuote}
        disabled={fetchingNext}
        style={{
          boxShadow: `0 0 25px ${palette.accentGlow}`
        }}
        className={`group relative flex items-center gap-3 px-8 py-3.5 rounded-full font-sans font-semibold text-sm tracking-wide transition-all duration-300 ${palette.buttonBg} shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <RefreshCw className={`w-4 h-4 transition-transform duration-500 ${fetchingNext ? 'animate-spin' : 'group-hover:rotate-180'}`} />
        <span>Next Quote</span>
      </motion.button>

      <p className="mt-4 text-[11px] font-mono text-slate-300 tracking-widest uppercase">
        Click to change quote & theme
      </p>
    </div>
  );
}
