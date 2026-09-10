import React, { useState, useRef, useEffect } from 'react';
import { Menu, Plus, List, Sparkles, Feather } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeaderDropdown({ onOpenListModal, onOpenAddModal, palette }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-40 px-6 py-5 flex items-center justify-between pointer-events-none">
            {/* Top Left Menu Dropdown (Pointer events enabled) */}
            <div className="relative pointer-events-auto" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Menu Options"
                    className={`group flex items-center gap-2.5 px-4 py-2.5 rounded-full glass-panel border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all duration-300 shadow-lg shadow-black/40 focus:outline-none focus:ring-2 focus:ring-white/20`}
                >
                    <Menu className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-90 text-white' : palette.accentText}`} />
                    <span className="text-xs font-medium uppercase tracking-wider hidden sm:inline-block">Menu</span>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="absolute left-0 mt-3 w-56 glass-dropdown rounded-2xl p-2 shadow-2xl shadow-black/80 z-50 border border-white/10 overflow-hidden"
                        >
                            <div className="px-3 py-2 border-b border-white/5 mb-1">
                                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold flex items-center gap-1.5">
                                    <Feather className="w-3 h-3 text-slate-400" /> Options
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    onOpenListModal();
                                }}
                                className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-white transition-colors duration-150 group"
                            >
                                <div className={`p-1.5 rounded-lg bg-white/5 group-hover:bg-white/10 ${palette.accentText}`}>
                                    <List className="w-4 h-4" />
                                </div>
                                <span>View All Quotes</span>
                            </button>

                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    onOpenAddModal();
                                }}
                                className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-white transition-colors duration-150 group"
                            >
                                <div className={`p-1.5 rounded-lg bg-white/5 group-hover:bg-white/10 ${palette.accentText}`}>
                                    <Plus className="w-4 h-4" />
                                </div>
                                <span>Add New Quote</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Top Right Subtle Badge */}
            <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full glass-card text-slate-400 text-xs font-mono">
                <Sparkles className={`w-3.5 h-3.5 ${palette.accentText}`} />
                <span>{palette.name}</span>
            </div>
        </header>
    );
}
